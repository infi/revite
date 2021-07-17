import { Client } from "revolt.js";
import { Channel, Message, User } from "revolt.js/dist/api/objects";

import { Text } from "preact-i18n";

import { Children } from "../../types/Preact";
import { useData } from "./hooks";

export function takeError(error: any): string {
    const type = error?.response?.data?.type;
    const id = type;
    if (!type) {
        if (error?.response?.status === 403) {
            return "Unauthorized";
        } else if (error && !!error.isAxiosError && !error.response) {
            return "NetworkError";
        }

        console.error(error);
        return "UnknownError";
    }

    return id;
}

export function useChannelName(
    channel_id: string,
    prefixType?: boolean,
): Children {
    return useData(
        (client) => {
            const channel = client.channels.get(channel_id);
            if (!channel) return null;

            if (channel.channel_type === "SavedMessages")
                return <Text id="app.navigation.tabs.saved" />;

            if (channel.channel_type === "DirectMessage") {
                const uid = client.channels.getRecipient(channel._id);
                return (
                    <>
                        {prefixType && "@"}
                        {client.users.get(uid)?.username}
                    </>
                );
            }

            if (channel.channel_type === "TextChannel" && prefixType) {
                return <>#{channel.name}</>;
            }

            return <>{channel.name}</>;
        },
        [{ key: "channels" }, { key: "users" }],
    );
}

export type MessageObject = Omit<Message, "edited"> & { edited?: string };
export function mapMessage(message: Partial<Message>) {
    const { edited, ...msg } = message;
    return {
        ...msg,
        edited: edited?.$date,
    } as MessageObject;
}
