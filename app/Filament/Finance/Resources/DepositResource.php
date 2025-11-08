<?php

namespace App\Filament\Finance\Resources;

use App\Filament\Finance\Resources\DepositResource\Pages;
use App\Filament\Finance\Resources\DepositResource\RelationManagers;
use App\Models\Deposit;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DepositResource extends Resource
{
    protected static ?string $model = Deposit::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationLabel = 'Deposit';
    protected static ?string $navigationGroup = 'Kas dan Deposit';
    protected static ?string $modelLabel = 'Deposit';
    protected static ?string $label = 'Deposit';
    protected static ?string $pluralLabel = 'Deposit';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('administrator_id')
                    ->label('Pengurus')
                    ->relationship('administrator', 'name')
                    ->disabledOn("edit")
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('administrator.name')
                    ->label('Pengurus')
                    ->searchable()
                    ->description(fn($record) => $record->administrator?->division?->name)
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_deposit_fund')
                    ->label('Total Dana')
                    ->money('IDR')
                    ->getStateUsing(fn($record) => $record->total_deposit_fund)
                    ->color('info')
                    ->summarize([
                        Tables\Columns\Summarizers\Summarizer::make()
                            ->label('Total')
                            ->using(function () {
                                return \App\Models\Deposit::with('depositFunds')->get()
                                    ->sum(fn($record) => $record->total_deposit_fund);
                            })
                            ->money('IDR')
                    ]),
                Tables\Columns\TextColumn::make("deposit")
                    ->label('Sisa Deposit')
                    ->money('IDR')
                    ->getStateUsing(fn($record) => $record->deposit)
                    ->weight('bold')
                    ->color(fn($record) => $record->deposit >= 0 ? 'success' : 'danger')
                    ->summarize([
                        Tables\Columns\Summarizers\Summarizer::make()
                            ->label('Total')
                            ->using(function () {
                                return \App\Models\Deposit::with(['depositFunds', 'depositPenalties'])->get()
                                    ->sum(fn($record) => $record->deposit);
                            })
                            ->money('IDR')
                    ]),
                Tables\Columns\TextColumn::make('plenary_meeting')
                    ->label('Rapat Pleno')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->plenary_meeting),
                Tables\Columns\TextColumn::make('jacket_day')
                    ->label('Jahim Day')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->jacket_day),
                Tables\Columns\TextColumn::make('graduation_ceremony')
                    ->label('Wisuda')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->graduation_ceremony),
                Tables\Columns\TextColumn::make('secretariat_maintenance')
                    ->label('Piket Pesek')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->secretariat_maintenance),
                Tables\Columns\TextColumn::make('work_program')
                    ->label('Proker')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->work_program),
                Tables\Columns\TextColumn::make('other')
                    ->label('Lainnya')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->other),
                Tables\Columns\TextColumn::make('total_penalty_amount')
                    ->label('Total Denda')
                    ->money('IDR')
                    ->default(0)
                    ->getStateUsing(fn($record) => $record->total_penalty_amount)
                    ->weight('bold')
                    ->color('danger')
                    ->summarize([
                        Tables\Columns\Summarizers\Summarizer::make()
                            ->label('Total')
                            ->using(function () {
                                return \App\Models\Deposit::with('depositPenalties')->get()
                                    ->sum(fn($record) => $record->total_penalty_amount);
                            })
                            ->money('IDR')
                    ]),
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
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label('Dihapus Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\DepositPenaltiesRelationManager::class,
            RelationManagers\DepositFundsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDeposits::route('/'),
            'create' => Pages\CreateDeposit::route('/create'),
            'edit' => Pages\EditDeposit::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['administrator.division', 'depositPenalties', 'depositFunds'])
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
