import { Entity, Column } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Entity('logger')
export class LoggerEntity extends BaseEntity {}
