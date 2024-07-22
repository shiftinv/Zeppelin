import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddGlobalNameToUsernameHistory1721658384853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("username_history", [
      new TableColumn({
        name: "global_name",
        type: "varchar",
        length: "160",
        isNullable: true,
        default: null,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("username_history", "global_name");
  }
}
