import { Module, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaConsumerService } from './kafka/kafka.consumer';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [
    AppService,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  // حتى لو عايز ممكن تحتفظ بال constructor
  constructor(private readonly kafkaConsumer: KafkaConsumerService) {
    this.logger.log('🚀 AppModule initialized! KafkaConsumerService injected.');
  }
}
