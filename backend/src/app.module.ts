import { ParentModule } from './parent/parent.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [AuthModule, UsersModule, SchoolModule, TeacherModule, ParentModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
