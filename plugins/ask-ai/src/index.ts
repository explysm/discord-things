import { storage } from "@vendetta/plugin";
import { registerCommand } from "@vendetta/commands";
import { showToast } from "@vendetta/ui/toasts";
import { Clipboard } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import Settings from "./Settings";

let unregisterCmd;

export default {
    onLoad: () => {
        // Initialize default storage
        storage.model ??= "mistralai/mistral-7b-instruct:free";

        unregisterCmd = registerCommand({
            name: "ask",
            displayName: "Ask AI",
            description: "Ask AI a question and copy response to clipboard",
            displayDescription: "Ask AI a question and copy response to clipboard",
            options: [
                {
                    name: "prompt",
                    displayName: "prompt",
                    description: "The question to ask",
                    required: true,
                    type: 3, // STRING
                },
            ],
            applicationId: -1,
            inputType: 1,
            type: 1,
            execute: async (args, ctx) => {
                const prompt = args[0]?.value;
                const apiKey = storage.apiKey;
                const model = storage.model;

                if (!prompt) {
                     showToast("Please provide a prompt.", getAssetIDByName("Small"));
                     return;
                }

                if (!apiKey) {
                    showToast("Please configure OpenRouter API Key in settings.", getAssetIDByName("Small"));
                    return;
                }

                showToast("Asking AI...", getAssetIDByName("ToastIcon"));

                try {
                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": "https://vendetta.mod",
                            "X-Title": "Vendetta Ask AI Plugin"
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: "user", content: prompt }
                            ]
                        })
                    });

                    if (!response.ok) {
                        const errText = await response.text();
                        console.error("OpenRouter Error:", errText);
                        showToast(`Error: ${response.status}`, getAssetIDByName("Small"));
                        return;
                    }

                    const data = await response.json();
                    const reply = data.choices?.[0]?.message?.content;

                    if (reply) {
                        Clipboard.setString(reply);
                        showToast("AI response copied to clipboard!", getAssetIDByName("Check"));
                    } else {
                        showToast("No response from AI.", getAssetIDByName("Small"));
                    }

                } catch (e) {
                    console.error(e);
                    showToast("Failed to fetch from AI.", getAssetIDByName("Small"));
                }
            },
        });
    },
    onUnload: () => {
        unregisterCmd?.();
    },
    settings: Settings,
};