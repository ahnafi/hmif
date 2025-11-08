<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkProgramAdministratorResource\Pages;
use App\Filament\Resources\WorkProgramAdministratorResource\RelationManagers;
use App\Models\WorkProgramAdministrator;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WorkProgramAdministratorResource extends Resource
{
    protected static ?string $model = WorkProgramAdministrator::class;
    protected static ?string $modelLabel = 'Pengurus Program Kerja';
    protected static ?string $label = 'Pengurus Program Kerja';
    protected static ?string $pluralLabel = 'Pengurus Program Kerja';

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationLabel = 'Program Kerja';
    protected static ?string $navigationGroup = 'Struktur Organisasi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('position')
                    ->label('Posisi')
                    ->options([
                        'Ketua' => 'Ketua',
                        'Wakil' => 'Wakil',
                        'Acara' => 'Acara',
                        'Lainnya' => 'Lainnya',
                    ])
                    ->required(),
                Forms\Components\Select::make('work_program_id')
                    ->label('Program Kerja')
                    ->relationship('workProgram', 'name')
                    ->required(),
                Forms\Components\Select::make('administrator_id')
                    ->label('Pengurus')
                    ->relationship('administrator', 'name')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('position')
                    ->label('Posisi')
                    ->searchable(),
                Tables\Columns\TextColumn::make('workProgram.name')
                    ->label('Program Kerja')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('administrator.name')
                    ->label('Pengurus')
                    ->numeric()
                    ->sortable(),
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
            'index' => Pages\ListWorkProgramAdministrators::route('/'),
            'create' => Pages\CreateWorkProgramAdministrator::route('/create'),
            'edit' => Pages\EditWorkProgramAdministrator::route('/{record}/edit'),
        ];
    }
}
