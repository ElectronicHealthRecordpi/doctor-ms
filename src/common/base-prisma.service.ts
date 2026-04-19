import { HttpStatus, Logger, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';



interface PrismaDelegate {
    findUnique(args: any): any;
    findMany(args: any): any;
    findFirst(args: any): any;
}

export abstract class BasePrismaSerice extends PrismaClient implements OnModuleInit {
    protected abstract readonly logger: Logger;
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    protected async ensureExists(
        delegate: PrismaDelegate,
        id: number | string,
        entityName: string,
    ): Promise<void> {
        const record = await delegate.findUnique({ where: { id } });
        if (!record) {
            this.logger.error(`${entityName} con ID ${id} no encontrado`);
            throw new UnprocessableEntityException(`${entityName} con ID ${id} no encontrado`);
        }
    }


}