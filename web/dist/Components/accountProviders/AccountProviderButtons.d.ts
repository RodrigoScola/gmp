export declare const AccountProviders: {
    readonly discord: {
        readonly color: "bg-blue-500";
        readonly Icon: import("react-icons/lib").IconType;
    };
};
export type AccountProviderType = keyof typeof AccountProviders;
export declare const ProviderButton: ({ handleClick, provider, }: {
    provider: AccountProviderType;
    handleClick: (provider: AccountProviderType) => Promise<void>;
}) => JSX.Element;
//# sourceMappingURL=AccountProviderButtons.d.ts.map