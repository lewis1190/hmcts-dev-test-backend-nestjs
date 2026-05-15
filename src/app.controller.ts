import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint', description: 'Returns a simple greeting message to verify the API is running.' })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: { example: 'Up and Running! 💪' }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
