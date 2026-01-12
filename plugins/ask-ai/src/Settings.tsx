import { Forms } from "@vendetta/ui/components";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { React } from "@vendetta/metro/common";

const { FormSection, FormInput } = Forms;

export default () => {
    useProxy(storage);

    return (
        <FormSection title="OpenRouter Settings">
            <FormInput
                title="API Key"
                placeholder="sk-or-..."
                value={storage.apiKey}
                onChange={(v: string) => (storage.apiKey = v)}
                isSecure={true}
            />
            <FormInput
                title="Model"
                placeholder="mistralai/mistral-7b-instruct:free"
                value={storage.model}
                onChange={(v: string) => (storage.model = v)}
            />
        </FormSection>
    );
};