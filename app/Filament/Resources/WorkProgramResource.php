<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkProgramResource\Pages;
use App\Filament\Resources\WorkProgramResource\RelationManagers;
use App\Models\WorkProgram;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WorkProgramResource extends Resource
{
    protected static ?string $model = WorkProgram::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Program Kerja';
    protected static ?string $navigationGroup = 'Struktur Organisasi';
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $modelLabel = 'Program Kerja';
    protected static ?string $label = 'Program Kerja';
    protected static ?string $pluralLabel = 'Program Kerja';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama Program')
                    ->required(),
                Forms\Components\Select::make('division_id')
                    ->label('Divisi')
                    ->relationship('division', 'name')
                    ->required(),
                Forms\Components\RichEditor::make('description')
                    ->label('Deskripsi')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('images')
                    ->label('Gambar')
                    ->directory('work_program')
                    ->previewable()
                    ->image()
                    ->imageEditor()
                    ->multiple()
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Program')
                    ->searchable(),
                Tables\Columns\TextColumn::make('division.name')
                    ->label('Divisi')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'work_program' => 'Program Kerja',
                        'work_agenda' => 'Agenda Kerja',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'work_program' => 'success',
                        'work_agenda' => 'info',
                        default => 'gray',
                    }),
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
            RelationManagers\WorkProgramAdministratorRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWorkPrograms::route('/'),
            'create' => Pages\CreateWorkProgram::route('/create'),
            'edit' => Pages\EditWorkProgram::route('/{record}/edit'),
        ];
    }
}
