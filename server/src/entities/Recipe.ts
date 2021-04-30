import { ObjectType, Field } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Recipe {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field(() => String, { nullable: true })
  description?: string | null;
  @Field(() => [String])
  ingredients: string[];
  @Field(() => String, { nullable: true })
  imageUrl?: string | null;
  @Field(() => User)
  owner: User;
  @Field(() => String)
  createdAt: Date;
  @Field(() => String)
  updatedAt: Date;
}
