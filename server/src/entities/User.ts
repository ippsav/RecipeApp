import { ObjectType, Field } from "type-graphql";
import { Recipe } from "./Recipe";

@ObjectType()
export class User {
  @Field()
  id: string;
  @Field()
  username: string;
  password: string;
  @Field(() => [Recipe], { nullable: true })
  recipes?: [Recipe] | null;
  @Field(() => String)
  createdAt: Date;
  @Field(() => String)
  updatedAt: Date;
}
