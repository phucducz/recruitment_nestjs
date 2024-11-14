import { Inject, Injectable } from '@nestjs/common';

import { CreateJobRecommendationDto } from 'src/dto/job_recomendations/create-job_recomendation.dto';
import { UpdateJobRecommendationDto } from 'src/dto/job_recomendations/update-job_recomendation.dto';
import { JobRecommendationRepository } from 'src/modules/job_recomendations/job_recomendations.repository';
import { DataSource } from 'typeorm';
import { ApplicationStatusService } from './application_status.service';
import { CloudinaryService } from './cloudinary.service';
import { JobPositionsService } from './job_positions.service';
import { JobsService } from './jobs.service';

@Injectable()
export class JobRecommendationsService {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    @Inject(JobRecommendationRepository)
    private readonly jobRecommendationRepository: JobRecommendationRepository,
    @Inject(JobsService) private readonly jobService: JobsService,
    @Inject(ApplicationStatusService)
    private readonly applicationStatusService: ApplicationStatusService,
    @Inject(JobPositionsService)
    private readonly jobPositionsService: JobPositionsService,
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createJobRecommendationDto: ICreate<
      CreateJobRecommendationDto & { file: Express.Multer.File }
    >,
  ) {
    const { variable } = createJobRecommendationDto;
    const { file, ...others } = variable;

    return this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const job = await this.jobService.findById(+variable.jobsId);
        const applicationStatus =
          await this.applicationStatusService.findByTitle('Đang đánh giá');
        const uploadResult = await this.cloudinaryService.uploadFile(file);

        return await this.jobRecommendationRepository.create({
          ...createJobRecommendationDto,
          variable: {
            ...others,
            job,
            applicationStatus,
            cvUrl: uploadResult.secure_url,
            fileName: file.originalname,
            ...(variable.jobPositionsId && {
              jobPosition: await this.jobPositionsService.findById(
                +variable.jobPositionsId,
              ),
            }),
          },
          transactionalEntityManager,
        });
      },
    );
  }

  findAll() {
    return `This action returns all jobRecomendations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobRecomendation`;
  }

  update(id: number, updateJobRecomendationDto: UpdateJobRecommendationDto) {
    return `This action updates a #${id} jobRecomendation`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobRecomendation`;
  }
}
