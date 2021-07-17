import { X } from "@styled-icons/boxicons-regular";
import { Channels } from "revolt.js/dist/api/objects";

import styles from "./ChannelInfo.module.scss";

import Modal from "../../../components/ui/Modal";

import Markdown from "../../../components/markdown/Markdown";
import { useChannel, useData, useForceUpdate } from "../../revoltjs/hooks";
import { useChannelName } from "../../revoltjs/util";

interface Props {
    channel_id: string;
    onClose: () => void;
}

export function ChannelInfo({ channel_id, onClose }: Props) {
    const description = useData(
        (client) => {
            const channel = client.channels.get(channel_id) as
                | Channels.GroupChannel
                | Channels.TextChannel
                | Channels.VoiceChannel;
            return channel.description;
        },
        [{ key: "channels" }],
    );

    return (
        <Modal visible={true} onClose={onClose}>
            <div className={styles.info}>
                <div className={styles.header}>
                    <h1>{useChannelName(channel_id, true)}</h1>
                    <div onClick={onClose}>
                        <X size={36} />
                    </div>
                </div>
                <p>
                    <Markdown content={description} />
                </p>
            </div>
        </Modal>
    );
}
