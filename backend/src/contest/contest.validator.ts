import { Injectable } from "@nestjs/common";
import { Contest } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { Validator } from "src/util/validator";

@Injectable()
export class ContestValidator implements Validator<Contest> {
    constructor(
        private prisma: PrismaService
    ) {}

    validate(records: Contest[]) {
        throw new Error("Method not implemented.");
    }

    private title(record: Contest) {
        // make sure title is the right size
    }

    private description(record: Contest) {
        // make sure description is the right size
    }

    private startTime(record: Contest) {
        if (record.startTime >= record.endTime) {
            throw new Error();
        }
        // make sure start time is in the future, but not too far in the future.
    }

    private endTime(record: Contest) {
        // make sure end time is after start time and a reasonable amount of time
    }

    private rules(record: Contest) {
        // validate that rule configuration is valid
    }
}