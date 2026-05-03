import { Logger, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface PrismaDelegate {
    findUnique(args: any): any;
    findMany(args: any): any;
    findFirst(args: any): any;
    create(args: any): any;
    update(args: any): any;
}

export abstract class BasePrismaService extends PrismaClient implements OnModuleInit {
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
        if (!record || record.isDeleted) {
            this.logger.error(`${entityName} con ID ${id} no encontrado`);
            throw new UnprocessableEntityException(`${entityName} con ID ${id} no encontrado`);
        }
    }

    protected async valueExists<T>(
        delegate: PrismaDelegate,
        field: keyof T,
        value: any,
        entityName: string,
        excludeId?: number | string
    ): Promise<boolean> {
        const record = await delegate.findFirst({ where: { [field]: value, id: { not: excludeId } } });
        if (record)
            return true
        return false;
    }



    protected async hasRecords<T>(
        delegate: PrismaDelegate,
        entityName: string,
    ): Promise<{ message: string; data: T[] }> {
        const records = await delegate.findMany({ where: { isDeleted: false } });
        if (records.length === 0) {
            this.logger.warn(`No se encontraron ${entityName}`);
            return {
                message: `Aún no se registraron ${entityName}`,
                data: [],
            };
        }
        return {
            message: `${entityName} obtenidos correctamente`,
            data: records,
        };
    }

    protected async softDelete(
        delegate: PrismaDelegate,
        id: string | number,
        entityName: string,
        extraData?: Record<string, any>,
    ): Promise<any> {
        await this.ensureExists(delegate, id, entityName);
        return await delegate.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                ...extraData,
            },
        });
    }
}