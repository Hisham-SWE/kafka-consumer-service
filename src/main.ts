import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Suppress specific warnings
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  const warningString = typeof warning === 'string' ? warning : warning?.toString() || '';
  const warningName = (typeof warning === 'object' && warning?.name) || '';
  const type = args[0] as string;

  if (
    warningString.includes('TimeoutNegativeWarning') ||
    warningName === 'TimeoutNegativeWarning' ||
    type === 'TimeoutNegativeWarning'
  ) {
    return;
  }
  return originalEmitWarning.call(process, warning, ...args);
};


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
