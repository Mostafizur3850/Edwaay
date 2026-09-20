IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [Products] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [Stock] int NOT NULL,
        [CategoryId] int NOT NULL,
        [BrandId] int NOT NULL,
        CONSTRAINT [PK_Products] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104045555_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260104045555_InitialCreate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104110422_AddFullNameIsActive'
)
BEGIN
    ALTER TABLE [AspNetUsers] ADD [FullName] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104110422_AddFullNameIsActive'
)
BEGIN
    ALTER TABLE [AspNetUsers] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104110422_AddFullNameIsActive'
)
BEGIN
    CREATE TABLE [RefreshTokens] (
        [Id] int NOT NULL IDENTITY,
        [Token] nvarchar(256) NOT NULL,
        [ExpiresAtUtc] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [RevokedAtUtc] datetime2 NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RefreshTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104110422_AddFullNameIsActive'
)
BEGIN
    CREATE UNIQUE INDEX [IX_RefreshTokens_Token] ON [RefreshTokens] ([Token]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104110422_AddFullNameIsActive'
)
BEGIN
    CREATE INDEX [IX_RefreshTokens_UserId] ON [RefreshTokens] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104110422_AddFullNameIsActive'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260104110422_AddFullNameIsActive', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104113141_AddUserNo'
)
BEGIN
    ALTER TABLE [AspNetUsers] ADD [UserNo] int NOT NULL IDENTITY;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104113141_AddUserNo'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AspNetUsers_UserNo] ON [AspNetUsers] ([UserNo]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260104113141_AddUserNo'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260104113141_AddUserNo', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE TABLE [MenuItems] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(150) NOT NULL,
        [Description] nvarchar(500) NULL,
        [ParentId] int NULL,
        [Url] nvarchar(400) NOT NULL,
        [WithoutView] bit NOT NULL,
        [Icon] nvarchar(80) NULL,
        [Sequence] int NOT NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_MenuItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MenuItems_MenuItems_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [MenuItems] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE TABLE [Permissions] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_Permissions] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE TABLE [ApplicationRoleMenus] (
        [RoleId] nvarchar(450) NOT NULL,
        [MenuId] int NOT NULL,
        CONSTRAINT [PK_ApplicationRoleMenus] PRIMARY KEY ([RoleId], [MenuId]),
        CONSTRAINT [FK_ApplicationRoleMenus_MenuItems_MenuId] FOREIGN KEY ([MenuId]) REFERENCES [MenuItems] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE TABLE [RoleMenuPermissions] (
        [RoleId] nvarchar(450) NOT NULL,
        [MenuId] int NOT NULL,
        [PermissionId] int NOT NULL,
        CONSTRAINT [PK_RoleMenuPermissions] PRIMARY KEY ([RoleId], [MenuId], [PermissionId]),
        CONSTRAINT [FK_RoleMenuPermissions_ApplicationRoleMenus_RoleId_MenuId] FOREIGN KEY ([RoleId], [MenuId]) REFERENCES [ApplicationRoleMenus] ([RoleId], [MenuId]) ON DELETE CASCADE,
        CONSTRAINT [FK_RoleMenuPermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name') AND [object_id] = OBJECT_ID(N'[Permissions]'))
        SET IDENTITY_INSERT [Permissions] ON;
    EXEC(N'INSERT INTO [Permissions] ([Id], [Name])
    VALUES (1, N''View''),
    (2, N''Create''),
    (3, N''Edit''),
    (4, N''Delete'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Name') AND [object_id] = OBJECT_ID(N'[Permissions]'))
        SET IDENTITY_INSERT [Permissions] OFF;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE INDEX [IX_ApplicationRoleMenus_MenuId] ON [ApplicationRoleMenus] ([MenuId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE INDEX [IX_ApplicationRoleMenus_RoleId] ON [ApplicationRoleMenus] ([RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE INDEX [IX_MenuItems_ParentId] ON [MenuItems] ([ParentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE INDEX [IX_MenuItems_ParentId_Sequence] ON [MenuItems] ([ParentId], [Sequence]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MenuItems_Url] ON [MenuItems] ([Url]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Permissions_Name] ON [Permissions] ([Name]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    CREATE INDEX [IX_RoleMenuPermissions_PermissionId] ON [RoleMenuPermissions] ([PermissionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260105050750_MenuRolePermission_StringRoleId'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260105050750_MenuRolePermission_StringRoleId', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114093723_NewSomeTable'
)
BEGIN
    DROP TABLE [Products];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114093723_NewSomeTable'
)
BEGIN
    CREATE TABLE [ErrorLogs] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedAtUtc] datetime2 NOT NULL,
        [TraceId] nvarchar(max) NOT NULL,
        [Path] nvarchar(max) NOT NULL,
        [Method] nvarchar(max) NOT NULL,
        [StatusCode] int NOT NULL,
        [UserId] nvarchar(max) NULL,
        [IpAddress] nvarchar(max) NULL,
        [UserAgent] nvarchar(max) NULL,
        [ExceptionType] nvarchar(max) NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [StackTrace] nvarchar(max) NULL,
        [InnerException] nvarchar(max) NULL,
        CONSTRAINT [PK_ErrorLogs] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114093723_NewSomeTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260114093723_NewSomeTable', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [AttributeDefinitions] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [IsVariantAttribute] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_AttributeDefinitions] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Brands] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Brands] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Carts] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NULL,
        [SessionId] nvarchar(max) NULL,
        [Currency] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Carts] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Categories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [ParentId] uniqueidentifier NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Categories_Categories_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Orders] (
        [Id] uniqueidentifier NOT NULL,
        [OrderNumber] nvarchar(max) NOT NULL,
        [UserId] uniqueidentifier NULL,
        [Currency] nvarchar(max) NOT NULL,
        [Subtotal] decimal(18,2) NOT NULL,
        [Tax] decimal(18,2) NOT NULL,
        [Shipping] decimal(18,2) NOT NULL,
        [Discount] decimal(18,2) NOT NULL,
        [GrandTotal] decimal(18,2) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Orders] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Vendors] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [StoreName] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Vendors] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Warehouses] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Warehouses] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [AttributeOptions] (
        [Id] uniqueidentifier NOT NULL,
        [AttributeDefinitionId] uniqueidentifier NOT NULL,
        [Value] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_AttributeOptions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AttributeOptions_AttributeDefinitions_AttributeDefinitionId] FOREIGN KEY ([AttributeDefinitionId]) REFERENCES [AttributeDefinitions] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [CartItems] (
        [Id] uniqueidentifier NOT NULL,
        [CartId] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [VariantId] uniqueidentifier NULL,
        [Quantity] int NOT NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_CartItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CartItems_Carts_CartId] FOREIGN KEY ([CartId]) REFERENCES [Carts] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [OrderItems] (
        [Id] uniqueidentifier NOT NULL,
        [OrderId] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [VariantId] uniqueidentifier NULL,
        [ProductName] nvarchar(max) NOT NULL,
        [Sku] nvarchar(max) NULL,
        [BrandName] nvarchar(max) NULL,
        [CategoryName] nvarchar(max) NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [Quantity] int NOT NULL,
        [LineTotal] decimal(18,2) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Payments] (
        [Id] uniqueidentifier NOT NULL,
        [OrderId] uniqueidentifier NOT NULL,
        [Provider] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [TransactionRef] nvarchar(max) NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Currency] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Payments_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Shipments] (
        [Id] uniqueidentifier NOT NULL,
        [OrderId] uniqueidentifier NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Carrier] nvarchar(max) NULL,
        [TrackingNumber] nvarchar(max) NULL,
        [ShippedAt] datetimeoffset NULL,
        [DeliveredAt] datetimeoffset NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Shipments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Shipments_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Products] (
        [Id] uniqueidentifier NOT NULL,
        [VendorId] uniqueidentifier NULL,
        [Name] nvarchar(max) NOT NULL,
        [Slug] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [BrandId] uniqueidentifier NULL,
        [Currency] nvarchar(max) NOT NULL,
        [IsPublished] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Products_Brands_BrandId] FOREIGN KEY ([BrandId]) REFERENCES [Brands] ([Id]),
        CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Products_Vendors_VendorId] FOREIGN KEY ([VendorId]) REFERENCES [Vendors] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [InventoryTransactions] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [VariantId] uniqueidentifier NULL,
        [WarehouseId] uniqueidentifier NULL,
        [Delta] int NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_InventoryTransactions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_InventoryTransactions_Warehouses_WarehouseId] FOREIGN KEY ([WarehouseId]) REFERENCES [Warehouses] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [ProductAttributeValues] (
        [ProductId] uniqueidentifier NOT NULL,
        [AttributeDefinitionId] uniqueidentifier NOT NULL,
        [AttributeOptionId] uniqueidentifier NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_ProductAttributeValues] PRIMARY KEY ([ProductId], [AttributeDefinitionId]),
        CONSTRAINT [FK_ProductAttributeValues_AttributeDefinitions_AttributeDefinitionId] FOREIGN KEY ([AttributeDefinitionId]) REFERENCES [AttributeDefinitions] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ProductAttributeValues_AttributeOptions_AttributeOptionId] FOREIGN KEY ([AttributeOptionId]) REFERENCES [AttributeOptions] ([Id]),
        CONSTRAINT [FK_ProductAttributeValues_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [ProductImages] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [Url] nvarchar(max) NOT NULL,
        [SortOrder] int NOT NULL,
        [IsPrimary] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_ProductImages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProductImages_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [ProductVariants] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [Sku] nvarchar(450) NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [Stock] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_ProductVariants] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProductVariants_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [Reviews] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Rating] int NOT NULL,
        [Comment] nvarchar(max) NULL,
        [IsApproved] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Reviews_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE TABLE [ProductVariantOptions] (
        [VariantId] uniqueidentifier NOT NULL,
        [AttributeDefinitionId] uniqueidentifier NOT NULL,
        [AttributeOptionId] uniqueidentifier NULL,
        [CustomValue] nvarchar(max) NULL,
        CONSTRAINT [PK_ProductVariantOptions] PRIMARY KEY ([VariantId], [AttributeDefinitionId]),
        CONSTRAINT [FK_ProductVariantOptions_AttributeDefinitions_AttributeDefinitionId] FOREIGN KEY ([AttributeDefinitionId]) REFERENCES [AttributeDefinitions] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ProductVariantOptions_AttributeOptions_AttributeOptionId] FOREIGN KEY ([AttributeOptionId]) REFERENCES [AttributeOptions] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_ProductVariantOptions_ProductVariants_VariantId] FOREIGN KEY ([VariantId]) REFERENCES [ProductVariants] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_AttributeOptions_AttributeDefinitionId] ON [AttributeOptions] ([AttributeDefinitionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_CartItems_CartId] ON [CartItems] ([CartId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_Categories_ParentId] ON [Categories] ([ParentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_InventoryTransactions_WarehouseId] ON [InventoryTransactions] ([WarehouseId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Payments_OrderId] ON [Payments] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_ProductAttributeValues_AttributeDefinitionId] ON [ProductAttributeValues] ([AttributeDefinitionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_ProductAttributeValues_AttributeOptionId] ON [ProductAttributeValues] ([AttributeOptionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_ProductImages_ProductId] ON [ProductImages] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_Products_BrandId] ON [Products] ([BrandId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Products_Slug] ON [Products] ([Slug]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_Products_VendorId] ON [Products] ([VendorId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_ProductVariantOptions_AttributeDefinitionId] ON [ProductVariantOptions] ([AttributeDefinitionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_ProductVariantOptions_AttributeOptionId] ON [ProductVariantOptions] ([AttributeOptionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_ProductVariants_ProductId] ON [ProductVariants] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ProductVariants_Sku] ON [ProductVariants] ([Sku]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE INDEX [IX_Reviews_ProductId] ON [Reviews] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Shipments_OrderId] ON [Shipments] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260114094409_EcommerceDomainAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260114094409_EcommerceDomainAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260115033239_BrandTableUpdate'
)
BEGIN
    ALTER TABLE [Brands] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260115033239_BrandTableUpdate'
)
BEGIN
    ALTER TABLE [Brands] ADD [LogoUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260115033239_BrandTableUpdate'
)
BEGIN
    ALTER TABLE [Brands] ADD [Slug] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260115033239_BrandTableUpdate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260115033239_BrandTableUpdate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260115102317_DocumentUoploadInfoTableAdd'
)
BEGIN
    CREATE TABLE [DocumentsInfo] (
        [Id] int NOT NULL IDENTITY,
        [DocType] int NOT NULL,
        [DocName] nvarchar(250) NOT NULL,
        [DocPath] nvarchar(max) NOT NULL,
        [DocSourceId] uniqueidentifier NOT NULL,
        [SourceFolder] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_DocumentsInfo] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260115102317_DocumentUoploadInfoTableAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260115102317_DocumentUoploadInfoTableAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    DECLARE @var sysname;
    SELECT @var = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Categories]') AND [c].[name] = N'Name');
    IF @var IS NOT NULL EXEC(N'ALTER TABLE [Categories] DROP CONSTRAINT [' + @var + '];');
    ALTER TABLE [Categories] ALTER COLUMN [Name] nvarchar(500) NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD [IconUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD [IsHighlight] bit NOT NULL DEFAULT CAST(0 AS bit);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD [ParentCategoryId] uniqueidentifier NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD [Serial] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD [Slug] nvarchar(500) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    CREATE INDEX [IX_Categories_ParentCategoryId] ON [Categories] ([ParentCategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    ALTER TABLE [Categories] ADD CONSTRAINT [FK_Categories_Categories_ParentCategoryId] FOREIGN KEY ([ParentCategoryId]) REFERENCES [Categories] ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116175659_CategoryTableUpdate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260116175659_CategoryTableUpdate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116180841_FixCategoryParent'
)
BEGIN
    ALTER TABLE [Categories] DROP CONSTRAINT [FK_Categories_Categories_ParentCategoryId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116180841_FixCategoryParent'
)
BEGIN
    DROP INDEX [IX_Categories_ParentCategoryId] ON [Categories];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116180841_FixCategoryParent'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Categories]') AND [c].[name] = N'ParentCategoryId');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Categories] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Categories] DROP COLUMN [ParentCategoryId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260116180841_FixCategoryParent'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260116180841_FixCategoryParent', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260120100600_CategoryMetaDataAdd'
)
BEGIN
    CREATE TABLE [categoryMetaKeywords] (
        [Id] uniqueidentifier NOT NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [Keyword] nvarchar(100) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_categoryMetaKeywords] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_categoryMetaKeywords_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260120100600_CategoryMetaDataAdd'
)
BEGIN
    CREATE INDEX [IX_categoryMetaKeywords_CategoryId] ON [categoryMetaKeywords] ([CategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260120100600_CategoryMetaDataAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260120100600_CategoryMetaDataAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [ProductVariants] ADD [OldPrice] decimal(18,2) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [Products] ADD [MetaDescription] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [Products] ADD [MetaKeywords] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [Products] ADD [MetaTitle] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [Products] ADD [ShortDescription] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [Products] ADD [TaxId] uniqueidentifier NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    CREATE TABLE [ProductTag] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_ProductTag] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProductTag_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    CREATE TABLE [Tax] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Rate] decimal(18,2) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Tax] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    CREATE INDEX [IX_Products_TaxId] ON [Products] ([TaxId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    CREATE INDEX [IX_ProductTag_ProductId] ON [ProductTag] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    ALTER TABLE [Products] ADD CONSTRAINT [FK_Products_Tax_TaxId] FOREIGN KEY ([TaxId]) REFERENCES [Tax] ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121032739_FixProductTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260121032739_FixProductTable', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121083152_TaxTableAdd'
)
BEGIN
    ALTER TABLE [Tax] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121083152_TaxTableAdd'
)
BEGIN
    ALTER TABLE [Products] ADD [VideoLink] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121083152_TaxTableAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260121083152_TaxTableAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    ALTER TABLE [ProductTag] DROP CONSTRAINT [FK_ProductTag_Products_ProductId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    ALTER TABLE [ProductTag] DROP CONSTRAINT [PK_ProductTag];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Products]') AND [c].[name] = N'MetaKeywords');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Products] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [Products] DROP COLUMN [MetaKeywords];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    EXEC sp_rename N'[ProductTag]', N'productTags', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    EXEC sp_rename N'[productTags].[IX_ProductTag_ProductId]', N'IX_productTags_ProductId', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    ALTER TABLE [productTags] ADD CONSTRAINT [PK_productTags] PRIMARY KEY ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    CREATE TABLE [productMetaKeywords] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [Keyword] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_productMetaKeywords] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_productMetaKeywords_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    CREATE INDEX [IX_productMetaKeywords_ProductId] ON [productMetaKeywords] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    ALTER TABLE [productTags] ADD CONSTRAINT [FK_productTags_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260121103304_ProductMetaKeywordAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260121103304_ProductMetaKeywordAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260127050150_CartDataAdd'
)
BEGIN
    ALTER TABLE [CartItems] ADD [ProductVariantId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260127050150_CartDataAdd'
)
BEGIN
    CREATE INDEX [IX_CartItems_ProductVariantId] ON [CartItems] ([ProductVariantId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260127050150_CartDataAdd'
)
BEGIN
    ALTER TABLE [CartItems] ADD CONSTRAINT [FK_CartItems_ProductVariants_ProductVariantId] FOREIGN KEY ([ProductVariantId]) REFERENCES [ProductVariants] ([Id]) ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260127050150_CartDataAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260127050150_CartDataAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260127062113_VaritanCorrectionAdd'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CartItems]') AND [c].[name] = N'VariantId');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [CartItems] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [CartItems] DROP COLUMN [VariantId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260127062113_VaritanCorrectionAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260127062113_VaritanCorrectionAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [CartItems] DROP CONSTRAINT [FK_CartItems_ProductVariants_ProductVariantId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    EXEC sp_rename N'[Payments].[TransactionRef]', N'TransactionId', 'COLUMN';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    EXEC sp_rename N'[Payments].[Provider]', N'Method', 'COLUMN';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Payments] ADD [GatewayPaymentId] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Payments] ADD [GatewayResponse] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Payments] ADD [GatewayStatus] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Payments] ADD [PaidAt] datetimeoffset NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Orders] ADD [PaymentMethod] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Orders] ADD [PaymentStatus] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [Orders] ADD [SessionId] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CartItems]') AND [c].[name] = N'ProductVariantId');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [CartItems] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [CartItems] ALTER COLUMN [ProductVariantId] uniqueidentifier NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    CREATE TABLE [paymentLogs] (
        [Id] uniqueidentifier NOT NULL,
        [PaymentId] uniqueidentifier NULL,
        [Event] nvarchar(max) NOT NULL,
        [Payload] nvarchar(max) NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_paymentLogs] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    CREATE TABLE [paymentTransactions] (
        [Id] uniqueidentifier NOT NULL,
        [PaymentId] uniqueidentifier NOT NULL,
        [Provider] nvarchar(max) NOT NULL,
        [TransactionId] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Currency] nvarchar(max) NOT NULL,
        [Response] nvarchar(max) NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_paymentTransactions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_paymentTransactions_Payments_PaymentId] FOREIGN KEY ([PaymentId]) REFERENCES [Payments] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    CREATE INDEX [IX_paymentTransactions_PaymentId] ON [paymentTransactions] ([PaymentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    ALTER TABLE [CartItems] ADD CONSTRAINT [FK_CartItems_ProductVariants_ProductVariantId] FOREIGN KEY ([ProductVariantId]) REFERENCES [ProductVariants] ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260128120057_UpGradeDb'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260128120057_UpGradeDb', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260129082522_UpdateSSLCommerceTable'
)
BEGIN
    ALTER TABLE [Payments] ADD [FailedAt] datetimeoffset NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260129082522_UpdateSSLCommerceTable'
)
BEGIN
    ALTER TABLE [Payments] ADD [Gateway] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260129082522_UpdateSSLCommerceTable'
)
BEGIN
    ALTER TABLE [Payments] ADD [GatewayPayload] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260129082522_UpdateSSLCommerceTable'
)
BEGIN
    ALTER TABLE [Payments] ADD [InitiatedAt] datetimeoffset NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260129082522_UpdateSSLCommerceTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260129082522_UpdateSSLCommerceTable', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260131054844_CouponTableAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260131054844_CouponTableAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260131070154_CouponTableUpdate'
)
BEGIN
    CREATE TABLE [Coupons] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Code] nvarchar(max) NOT NULL,
        [NumberOfTimes] int NOT NULL,
        [Discount] decimal(18,2) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [ExpiryDate] datetime2 NULL,
        CONSTRAINT [PK_Coupons] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260131070154_CouponTableUpdate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260131070154_CouponTableUpdate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260201113258_OfferServiceAddTable'
)
BEGIN
    CREATE TABLE [serviceOffers] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(150) NOT NULL,
        [Details] nvarchar(1000) NOT NULL,
        [ServiceLogo] nvarchar(255) NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_serviceOffers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260201113258_OfferServiceAddTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260201113258_OfferServiceAddTable', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE TABLE [generalSettings] (
        [Id] uniqueidentifier NOT NULL,
        [AppName] nvarchar(max) NOT NULL,
        [HomePageTitle] nvarchar(max) NOT NULL,
        [PrimaryColorCode] nvarchar(max) NOT NULL,
        [CurrencyDirection] nvarchar(max) NOT NULL,
        [DecimalSeparator] nvarchar(max) NOT NULL,
        [ThousandSeparator] nvarchar(max) NOT NULL,
        [SiteMetaDescription] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_generalSettings] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE TABLE [contactSettings] (
        [Id] uniqueidentifier NOT NULL,
        [StoreAddress] nvarchar(max) NOT NULL,
        [StorePhone] nvarchar(max) NOT NULL,
        [StoreEmail] nvarchar(max) NOT NULL,
        [GatewayImagePath] nvarchar(max) NOT NULL,
        [CopyrightText] nvarchar(max) NOT NULL,
        [GeneralSettingId] uniqueidentifier NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_contactSettings] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_contactSettings_generalSettings_GeneralSettingId] FOREIGN KEY ([GeneralSettingId]) REFERENCES [generalSettings] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE TABLE [mediaSettings] (
        [Id] uniqueidentifier NOT NULL,
        [LogoPath] nvarchar(max) NOT NULL,
        [GeneralSettingId] uniqueidentifier NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_mediaSettings] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_mediaSettings_generalSettings_GeneralSettingId] FOREIGN KEY ([GeneralSettingId]) REFERENCES [generalSettings] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE TABLE [siteMetaKeywords] (
        [Id] uniqueidentifier NOT NULL,
        [Keyword] nvarchar(max) NOT NULL,
        [GeneralSettingId] uniqueidentifier NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_siteMetaKeywords] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_siteMetaKeywords_generalSettings_GeneralSettingId] FOREIGN KEY ([GeneralSettingId]) REFERENCES [generalSettings] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE TABLE [socialLinks] (
        [Id] uniqueidentifier NOT NULL,
        [IconName] nvarchar(max) NOT NULL,
        [Url] nvarchar(max) NOT NULL,
        [ContactSettingId] uniqueidentifier NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_socialLinks] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_socialLinks_contactSettings_ContactSettingId] FOREIGN KEY ([ContactSettingId]) REFERENCES [contactSettings] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE TABLE [workingHours] (
        [Id] uniqueidentifier NOT NULL,
        [DayType] nvarchar(max) NOT NULL,
        [FromTime] time NOT NULL,
        [ToTime] time NOT NULL,
        [ContactSettingId] uniqueidentifier NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_workingHours] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_workingHours_contactSettings_ContactSettingId] FOREIGN KEY ([ContactSettingId]) REFERENCES [contactSettings] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE UNIQUE INDEX [IX_contactSettings_GeneralSettingId] ON [contactSettings] ([GeneralSettingId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE UNIQUE INDEX [IX_mediaSettings_GeneralSettingId] ON [mediaSettings] ([GeneralSettingId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE INDEX [IX_siteMetaKeywords_GeneralSettingId] ON [siteMetaKeywords] ([GeneralSettingId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE INDEX [IX_socialLinks_ContactSettingId] ON [socialLinks] ([ContactSettingId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    CREATE INDEX [IX_workingHours_ContactSettingId] ON [workingHours] ([ContactSettingId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202113354_GeneralSettingRelatedTableAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260202113354_GeneralSettingRelatedTableAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202124712_LogoPathAddInConctractTable'
)
BEGIN
    ALTER TABLE [contactSettings] ADD [LogoPath] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260202124712_LogoPathAddInConctractTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260202124712_LogoPathAddInConctractTable', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203033413_HomePageHeroSectionTableAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260203033413_HomePageHeroSectionTableAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE TABLE [heroSideBanners] (
        [Id] uniqueidentifier NOT NULL,
        [ImageUrl] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Subtitle] nvarchar(max) NULL,
        [Url] nvarchar(max) NOT NULL,
        [Position] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_heroSideBanners] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE TABLE [homePopularCategorySections] (
        [Id] uniqueidentifier NOT NULL,
        [SectionTitle] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homePopularCategorySections] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE TABLE [homeThreeColumnSections] (
        [Id] uniqueidentifier NOT NULL,
        [SectionTitle] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homeThreeColumnSections] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE TABLE [homeTopAds] (
        [Id] uniqueidentifier NOT NULL,
        [ImageUrl] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Subtitle] nvarchar(max) NULL,
        [Url] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homeTopAds] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE TABLE [homePopularCategoryItems] (
        [Id] uniqueidentifier NOT NULL,
        [SectionId] uniqueidentifier NOT NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [SubCategoryId] uniqueidentifier NULL,
        [ChildCategoryId] uniqueidentifier NULL,
        [SortOrder] int NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homePopularCategoryItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_homePopularCategoryItems_homePopularCategorySections_SectionId] FOREIGN KEY ([SectionId]) REFERENCES [homePopularCategorySections] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE TABLE [homeThreeColumnItems] (
        [Id] uniqueidentifier NOT NULL,
        [SectionId] uniqueidentifier NOT NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [SubCategoryId] uniqueidentifier NULL,
        [ChildCategoryId] uniqueidentifier NULL,
        [SortOrder] int NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homeThreeColumnItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_homeThreeColumnItems_homeThreeColumnSections_SectionId] FOREIGN KEY ([SectionId]) REFERENCES [homeThreeColumnSections] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE INDEX [IX_homePopularCategoryItems_SectionId] ON [homePopularCategoryItems] ([SectionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    CREATE INDEX [IX_homeThreeColumnItems_SectionId] ON [homeThreeColumnItems] ([SectionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203060841_HomePageHeroAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260203060841_HomePageHeroAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203061630_HomeHeroBannerAdd'
)
BEGIN
    CREATE TABLE [homeHeroBanners] (
        [Id] uniqueidentifier NOT NULL,
        [ImageUrl] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Subtitle] nvarchar(max) NULL,
        [Url] nvarchar(max) NOT NULL,
        [SortOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homeHeroBanners] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203061630_HomeHeroBannerAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260203061630_HomeHeroBannerAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203084925_HomeSliderTableAdd'
)
BEGIN
    CREATE TABLE [homeSliders] (
        [Id] uniqueidentifier NOT NULL,
        [HomePosition] int NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Link] nvarchar(500) NOT NULL,
        [Details] nvarchar(max) NULL,
        [BrandLogoUrl] nvarchar(max) NOT NULL,
        [SliderImageUrl] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [SortOrder] int NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_homeSliders] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203084925_HomeSliderTableAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260203084925_HomeSliderTableAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203111145_MaintainceTable'
)
BEGIN
    CREATE TABLE [maintenanceSettings] (
        [Id] uniqueidentifier NOT NULL,
        [IsMaintenanceMode] bit NOT NULL,
        [ImageUrl] nvarchar(500) NULL,
        [MaintenanceText] nvarchar(1000) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_maintenanceSettings] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260203111145_MaintainceTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260203111145_MaintainceTable', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204033712_UserProfileAdd'
)
BEGIN
    CREATE TABLE [userDeliveryAddresses] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [AddressLine] nvarchar(max) NOT NULL,
        [District] nvarchar(max) NOT NULL,
        [Mobile] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [IsDefault] bit NOT NULL,
        [UserId1] nvarchar(450) NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_userDeliveryAddresses] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_userDeliveryAddresses_AspNetUsers_UserId1] FOREIGN KEY ([UserId1]) REFERENCES [AspNetUsers] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204033712_UserProfileAdd'
)
BEGIN
    CREATE TABLE [userProfiles] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [PhoneNumber] nvarchar(max) NOT NULL,
        [ProfileImageUrl] nvarchar(max) NOT NULL,
        [IsSubscribed] bit NOT NULL,
        [UserId1] nvarchar(450) NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_userProfiles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_userProfiles_AspNetUsers_UserId1] FOREIGN KEY ([UserId1]) REFERENCES [AspNetUsers] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204033712_UserProfileAdd'
)
BEGIN
    CREATE INDEX [IX_userDeliveryAddresses_UserId1] ON [userDeliveryAddresses] ([UserId1]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204033712_UserProfileAdd'
)
BEGIN
    CREATE INDEX [IX_userProfiles_UserId1] ON [userProfiles] ([UserId1]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204033712_UserProfileAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260204033712_UserProfileAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204054338_UpdateUserProfile'
)
BEGIN
    ALTER TABLE [userProfiles] ADD [Email] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260204054338_UpdateUserProfile'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260204054338_UpdateUserProfile', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260208045538_FaqAdd'
)
BEGIN
    CREATE TABLE [faqCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_faqCategories] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260208045538_FaqAdd'
)
BEGIN
    CREATE TABLE [faqs] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [Details] nvarchar(2000) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_faqs] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_faqs_faqCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [faqCategories] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260208045538_FaqAdd'
)
BEGIN
    CREATE INDEX [IX_faqs_CategoryId] ON [faqs] ([CategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260208045538_FaqAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260208045538_FaqAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210080250_BlogAdd'
)
BEGIN
    CREATE TABLE [blogCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_blogCategories] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210080250_BlogAdd'
)
BEGIN
    CREATE TABLE [blogs] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [ImageUrl] nvarchar(max) NOT NULL,
        [BlogCategoryId] uniqueidentifier NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_blogs] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_blogs_blogCategories_BlogCategoryId] FOREIGN KEY ([BlogCategoryId]) REFERENCES [blogCategories] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210080250_BlogAdd'
)
BEGIN
    CREATE INDEX [IX_blogs_BlogCategoryId] ON [blogs] ([BlogCategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210080250_BlogAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260210080250_BlogAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083030_BlogTagAndMetaKeywordAdd'
)
BEGIN
    ALTER TABLE [blogs] ADD [MetaDescription] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083030_BlogTagAndMetaKeywordAdd'
)
BEGIN
    CREATE TABLE [BlogMetaKeyword] (
        [Id] uniqueidentifier NOT NULL,
        [BlogId] uniqueidentifier NOT NULL,
        [Keyword] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_BlogMetaKeyword] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_BlogMetaKeyword_blogs_BlogId] FOREIGN KEY ([BlogId]) REFERENCES [blogs] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083030_BlogTagAndMetaKeywordAdd'
)
BEGIN
    CREATE TABLE [BlogTag] (
        [Id] uniqueidentifier NOT NULL,
        [BlogId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_BlogTag] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_BlogTag_blogs_BlogId] FOREIGN KEY ([BlogId]) REFERENCES [blogs] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083030_BlogTagAndMetaKeywordAdd'
)
BEGIN
    CREATE INDEX [IX_BlogMetaKeyword_BlogId] ON [BlogMetaKeyword] ([BlogId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083030_BlogTagAndMetaKeywordAdd'
)
BEGIN
    CREATE INDEX [IX_BlogTag_BlogId] ON [BlogTag] ([BlogId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083030_BlogTagAndMetaKeywordAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260210083030_BlogTagAndMetaKeywordAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [BlogMetaKeyword] DROP CONSTRAINT [FK_BlogMetaKeyword_blogs_BlogId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [BlogTag] DROP CONSTRAINT [FK_BlogTag_blogs_BlogId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [BlogTag] DROP CONSTRAINT [PK_BlogTag];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [BlogMetaKeyword] DROP CONSTRAINT [PK_BlogMetaKeyword];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    EXEC sp_rename N'[BlogTag]', N'blogTags', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    EXEC sp_rename N'[BlogMetaKeyword]', N'blogMetaKeywords', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    EXEC sp_rename N'[blogTags].[IX_BlogTag_BlogId]', N'IX_blogTags_BlogId', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    EXEC sp_rename N'[blogMetaKeywords].[IX_BlogMetaKeyword_BlogId]', N'IX_blogMetaKeywords_BlogId', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [blogTags] ADD CONSTRAINT [PK_blogTags] PRIMARY KEY ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [blogMetaKeywords] ADD CONSTRAINT [PK_blogMetaKeywords] PRIMARY KEY ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [blogMetaKeywords] ADD CONSTRAINT [FK_blogMetaKeywords_blogs_BlogId] FOREIGN KEY ([BlogId]) REFERENCES [blogs] ([Id]) ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    ALTER TABLE [blogTags] ADD CONSTRAINT [FK_blogTags_blogs_BlogId] FOREIGN KEY ([BlogId]) REFERENCES [blogs] ([Id]) ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210083132_BlogTagAndMetaKeywordUpdate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260210083132_BlogTagAndMetaKeywordUpdate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210103326_BlogCategoryUpdate'
)
BEGIN
    ALTER TABLE [blogCategories] ADD [ImageUrl] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260210103326_BlogCategoryUpdate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260210103326_BlogCategoryUpdate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214051615_UpdateCoupon'
)
BEGIN
    ALTER TABLE [Orders] ADD [CouponCode] nvarchar(max) NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214051615_UpdateCoupon'
)
BEGIN
    ALTER TABLE [Coupons] ADD [DiscountType] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214051615_UpdateCoupon'
)
BEGIN
    ALTER TABLE [Coupons] ADD [UsedCount] int NOT NULL DEFAULT 0;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214051615_UpdateCoupon'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260214051615_UpdateCoupon', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214054039_AddorderAddress'
)
BEGIN
    CREATE TABLE [OrderAddress] (
        [Id] uniqueidentifier NOT NULL,
        [OrderId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Phone] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [District] nvarchar(max) NOT NULL,
        [AddressLine] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_OrderAddress] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OrderAddress_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214054039_AddorderAddress'
)
BEGIN
    CREATE UNIQUE INDEX [IX_OrderAddress_OrderId] ON [OrderAddress] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214054039_AddorderAddress'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260214054039_AddorderAddress', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    ALTER TABLE [OrderAddress] DROP CONSTRAINT [FK_OrderAddress_Orders_OrderId];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    ALTER TABLE [OrderAddress] DROP CONSTRAINT [PK_OrderAddress];
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    EXEC sp_rename N'[OrderAddress]', N'orderAddresses', 'OBJECT';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    EXEC sp_rename N'[orderAddresses].[IX_OrderAddress_OrderId]', N'IX_orderAddresses_OrderId', 'INDEX';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    ALTER TABLE [orderAddresses] ADD CONSTRAINT [PK_orderAddresses] PRIMARY KEY ([Id]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    ALTER TABLE [orderAddresses] ADD CONSTRAINT [FK_orderAddresses_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260214062126_AddorderAddressUpdate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260214062126_AddorderAddressUpdate', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260217110612_AddPage'
)
BEGIN
    CREATE TABLE [pages] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [DisplayLocation] nvarchar(max) NULL,
        [Details] nvarchar(max) NOT NULL,
        [MetaKeywords] nvarchar(max) NULL,
        [MetaDescription] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_pages] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260217110612_AddPage'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260217110612_AddPage', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260415063820_ProductQuestion'
)
BEGIN
    CREATE TABLE [dbo].[ProductQuestions] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Question] nvarchar(max) NOT NULL,
        [Answer] nvarchar(max) NULL,
        [IsApproved] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_ProductQuestions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProductQuestions_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260415063820_ProductQuestion'
)
BEGIN
    CREATE INDEX [IX_ProductQuestions_ProductId] ON [dbo].[ProductQuestions] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260415063820_ProductQuestion'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260415063820_ProductQuestion', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260416083116_Enents'
)
BEGIN
    CREATE TABLE [EventCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_EventCategories] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260416083116_Enents'
)
BEGIN
    CREATE TABLE [Events] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Slug] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [EventDate] datetime2 NOT NULL,
        [ImageUrl] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [EventCategoryId] uniqueidentifier NULL,
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_Events] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Events_EventCategories_EventCategoryId] FOREIGN KEY ([EventCategoryId]) REFERENCES [EventCategories] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260416083116_Enents'
)
BEGIN
    CREATE INDEX [IX_Events_EventCategoryId] ON [Events] ([EventCategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260416083116_Enents'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260416083116_Enents', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260628040323_ProductPartnumberAdd'
)
BEGIN
    ALTER TABLE [Products] ADD [PartNumber] nvarchar(max) NOT NULL DEFAULT N'';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260628040323_ProductPartnumberAdd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260628040323_ProductPartnumberAdd', N'9.0.11');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260712000000_AddPriceStatusAndPriceRequest'
)
BEGIN
    ALTER TABLE [Products] ADD [PriceStatus] nvarchar(50) NOT NULL DEFAULT N'Visible';
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260712000000_AddPriceStatusAndPriceRequest'
)
BEGIN
    CREATE TABLE [dbo].[ProductPriceRequests] (
        [Id] uniqueidentifier NOT NULL,
        [ProductId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [QuotedPrice] decimal(18,2) NULL,
        [Status] nvarchar(50) NOT NULL DEFAULT N'Pending',
        [CreatedAt] datetimeoffset NOT NULL,
        [UpdatedAt] datetimeoffset NOT NULL,
        CONSTRAINT [PK_ProductPriceRequests] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProductPriceRequests_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260712000000_AddPriceStatusAndPriceRequest'
)
BEGIN
    CREATE INDEX [IX_ProductPriceRequests_ProductId] ON [ProductPriceRequests] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260712000000_AddPriceStatusAndPriceRequest'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260712000000_AddPriceStatusAndPriceRequest', N'9.0.11');
END;

COMMIT;
GO

