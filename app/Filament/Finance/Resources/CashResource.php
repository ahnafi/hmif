<?php

namespace App\Filament\Finance\Resources;

use App\Filament\Finance\Resources\CashResource\Pages;
use App\Filament\Finance\Resources\CashResource\RelationManagers;
use App\Models\Cash;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CashResource extends Resource
{
    protected static ?string $model = Cash::class;

    protected static ?string $navigationIcon = 'heroicon-o-wallet';
    protected static ?string $navigationLabel = 'Kas';
    protected static ?string $navigationGroup = 'Kas dan Deposit';
    protected static ?string $modelLabel = 'Kas';
    protected static ?string $label = 'Kas';
    protected static ?string $pluralLabel = 'Kas';

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
        $months = [
            'april' => 'April',
            'may' => 'May', 
            'june' => 'June',
            'july' => 'July',
            'august' => 'August',
            'september' => 'September',
            'october' => 'October',
            'november' => 'November',
        ];

        $columns = [
            Tables\Columns\TextColumn::make('administrator.name')
                ->label('Pengurus')
                ->description(fn($record) => $record->administrator?->division?->name)
                ->searchable()
                ->sortable(),
        ];

        // Add month columns dynamically
        foreach ($months as $monthKey => $monthLabel) {
            $columns[] = Tables\Columns\TextColumn::make($monthKey)
                ->label($monthLabel)
                ->getStateUsing(fn($record) => $record->{$monthKey})
                ->money('IDR')
                ->summarize([
                    Tables\Columns\Summarizers\Summarizer::make()
                        ->label('Total')
                        ->using(fn() => \App\Models\Cash::getTotalByMonth($monthKey))
                        ->money('IDR')
                ]);
        }

        // Add total column
        $columns[] = Tables\Columns\TextColumn::make('total_cash_fund')
            ->label('Total')
            ->getStateUsing(fn($record) => $record->total_cash_fund)
            ->money('IDR')
            ->weight('bold')
            ->color('success')
            ->summarize([
                Tables\Columns\Summarizers\Summarizer::make()
                    ->label('Grand Total')
                    ->using(function() {
                        return \App\Models\Cash::with('cashFunds')->get()
                            ->sum(fn($record) => $record->total_cash_fund);
                    })
                    ->money('IDR')
            ]);

        // Add standard timestamp columns
        $columns = array_merge($columns, [
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
        ]);

        return $table
            ->columns($columns)
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
            RelationManagers\CashFundsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCashes::route('/'),
            'create' => Pages\CreateCash::route('/create'),
            'edit' => Pages\EditCash::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['cashFunds', 'administrator.division']) // Eager load relationships
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
