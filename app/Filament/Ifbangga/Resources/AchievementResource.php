<?php

namespace App\Filament\Ifbangga\Resources;

use App\Filament\Ifbangga\Resources\AchievementResource\Pages;
use App\Models\Achievement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AchievementResource extends Resource
{
    protected static ?string $model = Achievement::class;
    protected static ?string $navigationIcon = 'heroicon-o-trophy';
    protected static ?string $navigationLabel = 'Prestasi IF Bangga';
    protected static ?string $navigationGroup = 'Database IF Bangga';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $label = 'Prestasi IF Bangga';
    protected static ?string $pluralLabel = 'Prestasi IF Bangga';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama Prestasi')
                    ->required(),
                Forms\Components\TextInput::make('organizer')
                    ->label('Penyelenggara')
                    ->required(),
                Forms\Components\Select::make('students')
                    ->label('Mahasiswa')
                    ->relationship('students', 'nim')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->nim} - {$record->name}")
                    ->searchable(['name', 'nim'])
                    ->preload()
                    ->multiple()
                    ->required(),
                Forms\Components\Textarea::make('description')
                    ->label('Deskripsi')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('images')
                    ->label('Gambar')
                    ->previewable()
                    ->multiple()
                    ->openable()
                    ->directory('ifbangga-image')
                    ->image()
                    ->maxFiles(3)
                    ->maxSize(1024)
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('proof')
                    ->label('Bukti')
                    ->previewable()
                    ->openable()
                    ->maxSize(1024)
                    ->directory('ifbangga-proof')
                    ->columnSpanFull(),
                Forms\Components\DatePicker::make('awarded_at')
                    ->label('Tanggal Penghargaan'),
                Forms\Components\Select::make('achievement_type_id')
                    ->label('Tipe Prestasi')
                    ->relationship('achievementType', 'name')
                    ->required(),
                Forms\Components\Select::make('achievement_category_id')
                    ->label('Kategori Prestasi')
                    ->relationship('achievementCategory', 'name')
                    ->required(),
                Forms\Components\Select::make('achievement_level_id')
                    ->label('Tingkat Prestasi')
                    ->relationship('achievementLevel', 'name')
                    ->required(),
                Forms\Components\Toggle::make('approval')
                    ->label('Persetujuan')
                    ->nullable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Prestasi')
                    ->searchable(),
                Tables\Columns\TextColumn::make('organizer')
                    ->label('Penyelenggara')
                    ->searchable(),
                Tables\Columns\TextColumn::make('students.nim')
                    ->label('Mahasiswa')
                    ->formatStateUsing(function ($state, $record) {
                        return $record->students->pluck('nim')->join(', ');
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('awarded_at')
                    ->label('Tanggal Penghargaan')
                    ->date()
                    ->sortable(),
                Tables\Columns\IconColumn::make('approval')
                    ->label('Persetujuan')
                    ->boolean(),
                Tables\Columns\TextColumn::make('achievementType.name')
                    ->label('Tipe Prestasi')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('achievementCategory.name')
                    ->label('Kategori Prestasi')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('achievementLevel.name')
                    ->label('Tingkat Prestasi')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal Submit')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Diperbarui Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\Action::make('Approve')
                    ->color('success')
                    ->requiresConfirmation()
                    ->icon('heroicon-o-check')
                    ->visible(fn ($record) => $record->approval === null)
                    ->action(fn ($record) => $record->update(['approval' => true]))
                    ->successNotificationTitle('Achievement approved successfully'),

                Tables\Actions\Action::make('Reject')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->icon('heroicon-o-x-mark')
                    ->visible(fn ($record) => $record->approval === null)
                    ->action(fn ($record) => $record->update(['approval' => false]))
                    ->successNotificationTitle('Achievement rejected'),

                // Define actions for the table
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAchievements::route('/'),
            'create' => Pages\CreateAchievement::route('/create'),
            'edit' => Pages\EditAchievement::route('/{record}/edit'),
        ];
    }
}
