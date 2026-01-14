import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka.consumer';

@Module({
    providers: [KafkaConsumerService],
    exports: [KafkaConsumerService],
})
export class KafkaModule { }
