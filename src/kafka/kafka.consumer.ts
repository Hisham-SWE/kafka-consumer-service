import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaConsumerService.name);
    private kafka = new Kafka({
        clientId: 'consumer-service',
        brokers: ['localhost:9092'],
    });

    private consumer: Consumer = this.kafka.consumer({
        groupId: 'chat-consumers',
    });

    private isConnected = false;

    async onModuleInit() {
        this.logger.log('🔥 KafkaConsumerService initializing...');

        if (this.isConnected) {
            this.logger.warn('⚠️ Kafka consumer already connected. Skipping initialization.');
            return;
        }

        try {
            await this.consumer.connect();
            this.isConnected = true;
            this.logger.log('✅ [Kafka] Connected to broker');

            await this.consumer.subscribe({
                topic: 'order-placement',
                fromBeginning: true,
            });
            this.logger.log('✅ [Kafka] Subscribed to topic: order-placement');

            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    const value = message.value?.toString();
                    if (!value) return;

                    try {
                        const parsedMessage = JSON.parse(value);
                        this.logger.log(`📩 Kafka Message Received: ${value}`);

                        switch (parsedMessage.type) {
                            case 'ORDER_PLACED':
                                await this.processOrder(parsedMessage.payload);
                                break;
                            default:
                                this.logger.warn(`⚠️ Unknown message type: ${parsedMessage.type}`);
                        }
                    } catch (error) {
                        this.logger.error('❌ Failed to parse message', error);
                    }
                },
            });
        } catch (error) {
            this.logger.error('❌ Error in KafkaConsumerService:', error);
        }
    }

    async onModuleDestroy() {
        this.logger.log('🛑 KafkaConsumerService shutting down...');
        await this.consumer.disconnect();
        this.isConnected = false;
    }


    private async processOrder(payload: any) {
        const { order, timestamp } = payload;
        const orderId = order.orderId || order.id || 'UNKNOWN';
        this.logger.log(`📦 Processing Order #${orderId}...`);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment
        this.logger.log(`💳 Charging customer for Order #${orderId}...`);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate shipping
        this.logger.log(`🚚 Shipping Order #${orderId}...`);

        this.logger.log(`✅ Order #${orderId} processed successfully at ${new Date(timestamp).toISOString()}!`);
    }
}
