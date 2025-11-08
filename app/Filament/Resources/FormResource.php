<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FormResource\Pages;
use App\Filament\Resources\FormResource\RelationManagers;
use App\Models\Form;
use App\Models\FormField;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form as FilamentForm;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class FormResource extends Resource
{
    protected static ?string $model = Form::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Formulir';

    protected static ?string $navigationGroup = 'Form Builder';

    protected static ?string $recordTitleAttribute = 'title';
    protected static ?string $modelLabel = 'Formulir';
    protected static ?string $label = 'Formulir';
    protected static ?string $pluralLabel = 'Formulir';

    protected static ?int $navigationSort = 1;

    public static function form(FilamentForm $form): FilamentForm
    {
        return $form
            ->schema([
                Section::make('Informasi Formulir')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('title')
                                    ->label('Judul')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $context, $state, Forms\Set $set) => $context === 'create' ? $set('slug', Str::slug($state)) : null),

                                TextInput::make('slug')
                                    ->label('Slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Form::class, 'slug', ignoreRecord: true)
                                    ->rules(['alpha_dash']),
                            ]),

                        Textarea::make('description')
                            ->label('Deskripsi')
                            ->rows(3),

                        FileUpload::make('thumbnail')
                            ->label('Thumbnail')
                            ->image()
                            ->directory('form-thumbnails'),
                    ]),

                Section::make('Pengaturan Formulir')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Toggle::make('is_active')
                                    ->label('Aktif')
                                    ->default(true),

                                Toggle::make('allow_multiple_submissions')
                                    ->label('Izinkan Pengisian Berulang')
                                    ->default(true),

                                Toggle::make('is_anonymous')
                                    ->label('Anonim')
                                    ->default(false)
                                    ->helperText('Jika diaktifkan, data nama, email, nomor telepon, dan alamat IP tidak akan disimpan'),

                                TextInput::make('submission_limit')
                                    ->label('Batas Pengisian')
                                    ->numeric()
                                    ->minValue(1)
                                    ->placeholder('Kosongkan untuk tidak terbatas'),

                                TextInput::make('redirect')
                                    ->nullable()
                                    ->label('Diarahkan setelah mengisi')
                                    ->url()
                                    ->prefix('https://')
                                    ->placeholder('contoh.com/link-tujuan')
                                    ->helperText('URL akan otomatis ditambahkan https:// jika belum ada protokol')
                                    ->dehydrateStateUsing(function ($state) {
                                        if (empty($state)) {
                                            return null;
                                        }
                                        // Jika sudah ada http:// atau https://, kembalikan apa adanya
                                        if (preg_match('/^https?:\/\//i', $state)) {
                                            return $state;
                                        }
                                        // Jika belum ada protokol, tambahkan https://
                                        return 'https://' . $state;
                                    }),
                            ]),

                        Grid::make(2)
                            ->schema([
                                DateTimePicker::make('start_date')
                                    ->label('Tanggal Mulai'),

                                DateTimePicker::make('end_date')
                                    ->label('Tanggal Selesai')
                                    ->after('start_date'),
                            ]),
                    ]),

                Section::make('Form Fields')
                    ->schema([
                        Repeater::make('fields')
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        Select::make('type')
                                            ->options(FormField::getAvailableTypes())
                                            ->required()
                                            ->live()
                                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                                if (in_array($state, FormField::getFieldTypesWithoutInput())) {
                                                    $set('required', false);
                                                }
                                            }),

                                        TextInput::make('label')
                                            ->required()
                                            ->hidden(fn (Forms\Get $get) => in_array($get('type'), FormField::getFieldTypesWithoutInput())),

                                        Toggle::make('required')
                                            ->default(false)
                                            ->hidden(fn (Forms\Get $get) => in_array($get('type'), FormField::getFieldTypesWithoutInput())),
                                    ]),

                                TextInput::make('placeholder')
                                    ->visible(fn (Forms\Get $get) => in_array($get('type'), [
                                        FormField::TYPE_TEXT,
                                        FormField::TYPE_TEXTAREA,
                                        FormField::TYPE_EMAIL,
                                        FormField::TYPE_NUMBER,
                                    ])),

                                Textarea::make('content')
                                    ->label('Content')
                                    ->visible(fn (Forms\Get $get) => in_array($get('type'), [
                                        FormField::TYPE_HEADING,
                                        FormField::TYPE_PARAGRAPH,
                                    ])),

                                Textarea::make('help_text')
                                    ->label('Help Text')
                                    ->rows(2),

                                Repeater::make('options')
                                    ->schema([
                                        TextInput::make('label')
                                            ->required(),
                                        TextInput::make('value')
                                            ->required(),
                                    ])
                                    ->visible(fn (Forms\Get $get) => in_array($get('type'), FormField::getFieldTypesWithOptions()))
                                    ->minItems(1)
                                    ->addActionLabel('Add Option')
                                    ->columnSpanFull(),
                            ])
                            ->minItems(1)
                            ->addActionLabel('Add Field')
                            ->reorderable()
                            ->collapsible()
                            ->cloneable()
                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? $state['content'] ?? null)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Slug disalin!')
                    ->limit(30),

                BooleanColumn::make('is_active')
                    ->label('Aktif'),

                TextColumn::make('submission_count')
                    ->label('Pengisian')
                    ->getStateUsing(fn (Form $record) => $record->submissions()->count())
                    ->badge()
                    ->color('success'),

                TextColumn::make('submission_limit')
                    ->label('Batas')
                    ->placeholder('Tidak terbatas'),

                TextColumn::make('start_date')
                    ->label('Tanggal Mulai')
                    ->dateTime()
                    ->placeholder('Tidak ada batas'),

                TextColumn::make('end_date')
                    ->label('Tanggal Selesai')
                    ->dateTime()
                    ->placeholder('Tidak ada batas'),

                TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status'),
            ])
            ->actions([
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Form $record): string => route('forms.show', $record->slug))
                    ->openUrlInNewTab(),
                Action::make('viewSubmissions')
                    ->label('View Submissions')
                    ->icon('heroicon-o-document-text')
                    ->url(fn (Form $record): string => static::getUrl('edit', ['record' => $record->id]).'#submissions')
                    ->color('info'),
                ActionGroup::make([
                    Tables\Actions\EditAction::make(),
                    Action::make('clone')
                        ->label('Clone')
                        ->icon('heroicon-o-document-duplicate')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->modalHeading('Clone Form')
                        ->modalDescription('Are you sure you want to clone this form? A new form will be created with the same fields.')
                        ->modalSubmitActionLabel('Clone')
                        ->action(function (Form $record) {
                            // Clone the form
                            $newForm = $record->replicate();
                            $newForm->title = $record->title.' (Copy)';
                            $newForm->slug = Str::slug($record->title.' Copy '.now()->timestamp);
                            $newForm->is_active = false; // Set inactive by default for safety
                            $newForm->thumbnail = $record->thumbnail; // Copy thumbnail path

                            // Keep the same fields array
                            $newForm->fields = $record->fields;

                            $newForm->save();

                            Notification::make()
                                ->title('Form cloned successfully')
                                ->success()
                                ->body('The form "'.$newForm->title.'" has been created. You can now edit it.')
                                ->send();

                            // Redirect to edit the new form
                            return redirect(static::getUrl('edit', ['record' => $newForm->id]));
                        }),
                    Tables\Actions\DeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\SubmissionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListForms::route('/'),
            'create' => Pages\CreateForm::route('/create'),
            'edit' => Pages\EditForm::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
