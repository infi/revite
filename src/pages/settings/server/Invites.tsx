import { XCircle } from "@styled-icons/boxicons-regular";
import {
    Channels,
    Invites as InvitesNS,
    Servers,
} from "revolt.js/dist/api/objects";

import styles from "./Panes.module.scss";
import { useContext, useEffect, useState } from "preact/hooks";

import { AppContext } from "../../../context/revoltjs/RevoltClient";
import { useData } from "../../../context/revoltjs/hooks";
import { getChannelName } from "../../../context/revoltjs/util";

import UserIcon from "../../../components/common/user/UserIcon";
import IconButton from "../../../components/ui/IconButton";
import Preloader from "../../../components/ui/Preloader";

interface Props {
    server: Servers.Server;
}

export function Invites({ server }: Props) {
    const [invites, setInvites] = useState<
        InvitesNS.ServerInvite[] | undefined
    >(undefined);

    const [deleting, setDelete] = useState<string[]>([]);

    const client = useContext(AppContext);
    const { users, channels } = useData(
        (client) => {
            if (!invites)
                return {
                    users: [],
                    channels: [],
                };

            return {
                users: client.users
                    .mapKeys(Array.from(new Set(invites.map((x) => x.creator))))
                    .filter((x) => typeof x !== "undefined")
                    .map((x) => {
                        return {
                            id: x!._id,
                            username: x!.username,
                        };
                    }),
                channels: (
                    client.channels
                        .mapKeys(
                            Array.from(new Set(invites.map((x) => x.channel))),
                        )
                        .filter((x) => typeof x !== "undefined") as (
                        | Channels.TextChannel
                        | Channels.VoiceChannel
                        | Channels.GroupChannel
                    )[]
                ).map((x) => {
                    return {
                        id: x!._id,
                        name: x.name,
                    };
                }),
            };
        },
        [{ key: "users" }, { key: "channels" }],
    );

    useEffect(() => {
        client.servers
            .fetchInvites(server._id)
            .then((invites) => setInvites(invites));
    }, []);

    // ! HOOKS
    return (
        <div className={styles.invites}>
            <div className={styles.subtitle}>
                <span>Invite Code</span>
                <span>Invitor</span>
                <span>Channel</span>
                <span>Revoke</span>
            </div>
            {typeof invites === "undefined" && <Preloader type="ring" />}
            {invites?.map((invite) => {
                const creator = users.find((x) => x.id === invite.creator);
                const channel = channels.find((x) => x.id === invite.channel);

                return (
                    <div
                        className={styles.invite}
                        data-deleting={deleting.indexOf(invite._id) > -1}>
                        <code>{invite._id}</code>
                        <span>
                            {/*<UserIcon target={creator} size={24} />{" "}*/}
                            {creator?.username ?? "unknown"}
                        </span>
                        <span>
                            {channel?.name}
                            {/*channel && creator
                                ? getChannelName(ctx.client, channel, true)
                                : "#unknown"*/}
                        </span>
                        <IconButton
                            onClick={async () => {
                                setDelete([...deleting, invite._id]);

                                await client.deleteInvite(invite._id);

                                setInvites(
                                    invites?.filter(
                                        (x) => x._id !== invite._id,
                                    ),
                                );
                            }}
                            disabled={deleting.indexOf(invite._id) > -1}>
                            <XCircle size={24} />
                        </IconButton>
                    </div>
                );
            })}
        </div>
    );
}
