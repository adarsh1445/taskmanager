"""Updated model changes

Revision ID: 54046081c328
Revises: 
Create Date: 2025-02-18 07:56:27.381030

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '54046081c328'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the tasks table first to remove the foreign key constraint
    op.drop_index('ix_tasks_title', table_name='tasks')
    op.drop_index('ix_tasks_id', table_name='tasks')
    op.drop_table('tasks')  # Drop dependent table first

    # Now drop the users table
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_table('users')  # Then drop users
    
    op.execute("DROP TABLE IF EXISTS tasks CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")


def downgrade() -> None:
    # Recreate the users table first
    op.create_table('users',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='users_pkey')
    )
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Now recreate the tasks table
    op.create_table('tasks',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('status', postgresql.ENUM('todo', 'in_progress', 'completed', name='taskstatus'), autoincrement=False, nullable=True),
        sa.Column('priority', postgresql.ENUM('low', 'medium', 'high', name='taskpriority'), autoincrement=False, nullable=True),
        sa.Column('due_date', sa.TIMESTAMP(), autoincrement=False, nullable=True),
        sa.Column('assignee', sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='tasks_user_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='tasks_pkey')
    )
    op.create_index('ix_tasks_title', 'tasks', ['title'], unique=False)
    op.create_index('ix_tasks_id', 'tasks', ['id'], unique=False)