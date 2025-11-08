<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AchievementLevelResource\Pages;
use App\Filament\Resources\AchievementLevelResource\RelationManagers;
use App\Models\AchievementLevel;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AchievementLevelResource extends Resource
{
    protected static ?string $model = AchievementLevel::class;
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Tingkat Prestasi';
    protected static ?string $navigationGroup = 'Database IF Bangga';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $modelLabel = 'Tingkat Prestasi';
    protected static ?string $label = 'Tingkat Prestasi';
    protected static ?string $pluralLabel = 'Tingkat Prestasi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama Tingkat')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Tingkat')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
                Tables\Actions\EditAction::make(),
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAchievementLevels::route('/'),
            'create' => Pages\CreateAchievementLevel::route('/create'),
            'edit' => Pages\EditAchievementLevel::route('/{record}/edit'),
        ];
    }
}
