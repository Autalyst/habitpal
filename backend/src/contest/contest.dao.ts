import { Contest } from "@prisma/client";
import { DAO } from "src/util/dao";
import { ContestValidator } from "./contest.validator";
import { PrismaService } from "src/prisma/prisma.service";

export class ContestDao extends DAO<Contest> {
    constructor(
        private prisma: PrismaService,
        private contestValidator: ContestValidator
    ) {
        super(contestValidator)
    }

    findOne(condition: any): Contest {
        throw new Error("Method not implemented.");
    }

    findMany(condition: any): Contest[] {
        throw new Error("Method not implemented.");
    }

    create(record: Contest): Contest {
        this.contestValidator.validate([record]);
        throw new Error("Method not implemented.");
    }

    createMany(records: Contest[]): Contest[] {
        this.contestValidator.validate(records);
        throw new Error("Method not implemented.");
    }

    delete(record: Contest) {
        throw new Error("Method not implemented.");
    }

    deleteMany(records: Contest[]) {
        throw new Error("Method not implemented.");
    }
}