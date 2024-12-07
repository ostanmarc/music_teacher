from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from alembic import context

import sys
import os

from src.services.database import Base  # Import your declarative base
from src.models.models import Note, Scale  # Import your models

# Load the database URL from the Alembic configuration.
config = context.config
DATABASE_URL = config.get_main_option("sqlalchemy.url")

# Create an asynchronous engine.
connectable = create_async_engine(DATABASE_URL, poolclass=pool.NullPool)

target_metadata = Base.metadata

def run_migrations_online():
    """Run migrations in 'online' mode with asynchronous support."""
    async def do_run_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(context.configure, connection=connection, target_metadata=Base.metadata)

            async with connection.begin() as transaction:
                await context.run_migrations()

    import asyncio
    asyncio.run(do_run_migrations())
