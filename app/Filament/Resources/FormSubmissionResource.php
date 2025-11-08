<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FormSubmissionResource\Pages;
use App\Models\FormSubmission;
use App\Models\Form;
use Filament\Forms;
use Filament\Forms\Form as FilamentForm;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Actions\Action;
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\Section;

class FormSubmissionResource extends Resource
{
    protected static ?string $model = FormSubmission::class;

    protected static ?string $navigationIcon = 'heroicon-o-inbox-stack';
    protected static ?string $navigationLabel = 'Hasil Pengisian';
    protected static ?string $navigationGroup = 'Form Builder';
    protected static ?string $recordTitleAttribute = 'nim';
    protected static ?string $modelLabel = 'Hasil Pengisian';
    protected static ?string $label = 'Hasil Pengisian';
    protected static ?string $pluralLabel = 'Hasil Pengisian';

    protected static ?int $navigationSort = 2;

    public static function form(FilamentForm $form): FilamentForm
    {
        return $form
            ->schema([
                // Read-only form for viewing submissions
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                
                TextColumn::make('form.title')
                    ->label('Formulir')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('submitted_by_name')
                    ->label('Nama')
                    ->searchable()
                    ->placeholder('Anonim'),
                
                TextColumn::make('submitted_by_email')
                    ->label('Email')
                    ->searchable()
                    ->placeholder('Tidak tersedia'),
                
                TextColumn::make('submitted_by_phone')
                    ->label('Telepon')
                    ->placeholder('Tidak tersedia'),
                
                TextColumn::make('ip_address')
                    ->label('Alamat IP'),
                
                TextColumn::make('created_at')
                    ->label('Diisi Pada')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('form_id')
                    ->label('Formulir')
                    ->options(Form::pluck('title', 'id'))
                    ->searchable(),
            ])
            ->actions([
                Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-eye')
                    ->modalHeading(fn (FormSubmission $record) => "Submission for: {$record->form->title}")
                    ->infolist([
                        Section::make('Form Information')
                            ->schema([
                                TextEntry::make('form.title')
                                    ->label('Form Title'),
                                TextEntry::make('form.description')
                                    ->label('Description')
                                    ->placeholder('No description'),
                            ])
                            ->columns(2),
                        
                        Section::make('Submitter Information')
                            ->schema([
                                TextEntry::make('submitted_by_name')
                                    ->label('Name')
                                    ->placeholder('Anonymous'),
                                TextEntry::make('submitted_by_email')
                                    ->label('Email')
                                    ->placeholder('Not provided'),
                                TextEntry::make('submitted_by_phone')
                                    ->label('Phone')
                                    ->placeholder('Not provided'),
                                TextEntry::make('ip_address')
                                    ->label('IP Address'),
                                TextEntry::make('created_at')
                                    ->label('Submitted At')
                                    ->dateTime(),
                            ])
                            ->columns(2),
                        
                        Section::make('Submission Data')
                            ->schema([
                                TextEntry::make('formatted_data')
                                    ->label('')
                                    ->html()
                                    ->getStateUsing(function (FormSubmission $record) {
                                        $html = '<div class="space-y-3">';
                                        foreach ($record->data as $key => $value) {
                                            $html .= '<div class="flex flex-col space-y-1">';
                                            $html .= '<dt class="font-medium text-sm text-gray-500">' . e($key) . '</dt>';
                                            
                                            if (is_array($value)) {
                                                $html .= '<dd class="text-sm text-gray-900">' . (empty($value) ? 'No selection' : e(implode(', ', $value))) . '</dd>';
                                            } elseif (is_string($value) && str_starts_with($value, 'form-submissions/')) {
                                                // Convert file path to clickable link
                                                $url = asset('storage/' . $value);
                                                $filename = basename($value);
                                                $html .= '<dd class="text-sm"><a href="' . $url . '" target="_blank" class="text-blue-600 hover:text-blue-800 underline flex items-center gap-1">';
                                                $html .= '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>';
                                                $html .= e($filename) . '</a></dd>';
                                            } else {
                                                $html .= '<dd class="text-sm text-gray-900">' . e($value ?: 'Not provided') . '</dd>';
                                            }
                                            
                                            $html .= '</div>';
                                        }
                                        $html .= '</div>';
                                        return $html;
                                    }),
                            ]),
                    ]),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListFormSubmissions::route('/'),
        ];
    }
}
