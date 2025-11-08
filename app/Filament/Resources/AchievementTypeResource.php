<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AchievementTypeResource\Pages;
use App\Filament\Resources\AchievementTypeResource\RelationManagers;
use App\Models\AchievementType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AchievementTypeResource extends Resource
{
    protected static ?string $model = AchievementType::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';
    protected static ?string $navigationLabel = 'Tipe Prestasi';
    protected static ?string $navigationGroup = 'Database IF Bangga';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $modelLabel = 'Tipe Prestasi';
    protected static ?string $label = 'Tipe Prestasi';
    protected static ?string $pluralLabel = 'Tipe Prestasi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama Tipe')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Tipe')
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
            'index' => Pages\ListAchievementTypes::route('/'),
            'create' => Pages\CreateAchievementType::route('/create'),
            'edit' => Pages\EditAchievementType::route('/{record}/edit'),
        ];
    }
}
