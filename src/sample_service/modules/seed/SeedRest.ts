import {
    Body,
    CurrentUser,
    Get,
    JsonController,
    Param,
    Post,
    Put
} from "routing-controllers";
import {SeedService} from "./SeedService";
import Seed from "./models/Seed";
import {Response} from "../../../index";
import {AuthUser} from "../../../security";

@JsonController("/seeds")
export class SeedRest {

    constructor(private seedService: SeedService) {
    }

    @Get("/")
    async findAll(@CurrentUser() user: AuthUser): Promise<Response<Seed[]>> {
        return Response.ok(await this.seedService.findAll(user));
    }

    @Get("/:id")
    async findById(@Param("id") id: string): Promise<Response<Seed>> {
        return Response.ok(await this.seedService.findById(id));
    }

    @Post("")
    async create(@Body() seed: Seed,
                 @CurrentUser() user?: AuthUser): Promise<Response<Seed>> {
        return Response.ok(await this.seedService.create(seed, user));
    }

    @Put("/:id")
    async update(@Body() seed: Seed): Promise<Response<Seed>> {
        return Response.ok(await this.seedService.create(seed, null));
    }
}
