import styled from "styled-components";

import { attachContextMenu } from "preact-context-menu";

import { TextReact } from "../../../lib/i18n";

import { MessageObject } from "../../../context/revoltjs/util";

import UserShort from "../user/UserShort";
import MessageBase, { MessageDetail, MessageInfo } from "./MessageBase";

const SystemContent = styled.div`
    gap: 4px;
    display: flex;
    padding: 2px 0;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: row;
`;

interface Props {
    attachContext?: boolean;
    message: MessageObject;
    highlight?: boolean;
    hideInfo?: boolean;
}

export function SystemMessage({
    attachContext,
    message,
    highlight,
    hideInfo,
}: Props) {
    let children;
    const content = message.content;
    if (typeof content === "object") {
        switch (content.type) {
            case "text":
                children = <span>{content.content}</span>;
                break;
            case "user_added":
            case "user_remove":
                children = (
                    <TextReact
                        id={`app.main.channel.system.${
                            content.type === "user_added"
                                ? "added_by"
                                : "removed_by"
                        }`}
                        fields={{
                            user: <UserShort user_id={content.id} />,
                            other_user: <UserShort user_id={content.by} />,
                        }}
                    />
                );
                break;
            case "user_joined":
            case "user_left":
            case "user_kicked":
            case "user_banned":
                children = (
                    <TextReact
                        id={`app.main.channel.system.${content.type}`}
                        fields={{
                            user: <UserShort user_id={content.id} />,
                        }}
                    />
                );
                break;
            case "channel_renamed":
                children = (
                    <TextReact
                        id={`app.main.channel.system.channel_renamed`}
                        fields={{
                            user: <UserShort user_id={content.by} />,
                            name: <b>{content.name}</b>,
                        }}
                    />
                );
                break;
            case "channel_description_changed":
            case "channel_icon_changed":
                children = (
                    <TextReact
                        id={`app.main.channel.system.${content.type}`}
                        fields={{
                            user: <UserShort user_id={content.by} />,
                        }}
                    />
                );
                break;
            default:
                children = JSON.stringify(content);
        }
    } else {
        children = content;
    }

    return (
        <MessageBase
            highlight={highlight}
            onContextMenu={
                attachContext
                    ? attachContextMenu("Menu", {
                          message,
                          contextualChannel: message.channel,
                      })
                    : undefined
            }>
            {!hideInfo && (
                <MessageInfo>
                    <MessageDetail message={message} position="left" />
                </MessageInfo>
            )}
            <SystemContent>{children}</SystemContent>
        </MessageBase>
    );
}
