A translation serializer that generates the mapping file for the legacy message ID migration.
The file is used by the `localize-migrate` script to migrate existing translation files from
the legacy message IDs to the canonical ones.

为旧版消息 ID 迁移生成映射文件的翻译序列化器。`localize-migrate`
脚本使用该文件将现有的翻译文件从旧版消息 ID 迁移到规范消息 ID。

Returns true if a message needs to be migrated.

如果需要迁移消息，则返回 true。