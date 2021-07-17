import { Text } from "preact-i18n";

import { useData } from "../../../context/revoltjs/hooks";

import UserIcon from "./UserIcon";

export function Username({
    username,
    ...otherProps
}: { username?: string } & JSX.HTMLAttributes<HTMLElement>) {
    return (
        <span {...otherProps}>
            {username ?? <Text id="app.main.channel.unknown_user" />}
        </span>
    );
}

export default function UserShort({
    user_id,
    size,
}: {
    user_id?: string;
    size?: number;
}) {
    const username = useData(
        (client) => (user_id ? client.users.get(user_id)?.username : undefined),
        [{ key: "users" }],
    );

    return (
        <>
            <UserIcon size={size ?? 24} target={user_id} />
            <Username username={username} />
        </>
    );
}
