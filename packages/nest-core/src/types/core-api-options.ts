export type CoreI18nOptions = {
  i18n?: {
    // Additional translation roots relative to app cwd or absolute
    extraTranslationPaths?: string[];
    // Where to write generated i18n typings (file path). Default: src/generated/i18n.generated.ts
    typesOutputPath?: string;
  };
};

export type CoreApiOptions = CoreI18nOptions & {
  bullBoard?: {
    enabled?: boolean;
    route?: string;
    // Expect array of { name, adapter } objects as accepted by BullBoardModule.forFeature
    features?: Array<Record<string, any>>;
  };
};
