<?php

namespace App\Filament\Resources\WorkProgramResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WorkProgramAdministratorRelationManager extends RelationManager
{
    protected static string $relationship = 'WorkProgramAdministrators';
    protected static ?string $modelLabel = 'Pengurus Program Kerja';
    protected static ?string $label = 'Pengurus Program Kerja';
    protected static ?string $pluralLabel = 'Pengurus Program Kerja';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('position')
                    ->label('Posisi')
                    ->required()
                    ->maxLength(255),
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

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('position')
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
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
