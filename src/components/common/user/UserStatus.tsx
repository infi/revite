import { Users } from "revolt.js/dist/api/objects";

import { Text } from "preact-i18n";

import { useData } from "../../../context/revoltjs/hooks";

import Tooltip from "../Tooltip";

interface Props {
    user_id?: string;
    tooltip?: boolean;
}

export default function UserStatus({ user_id, tooltip }: Props) {
    const { online, status } = useData(
        (client) => {
            const user = user_id ? client.users.get(user_id) : undefined;

            return {
                online: user?.online,
                status: user?.status,
            };
        },
        [{ key: "users" }],
    );

    if (online) {
        if (status?.text) {
            if (tooltip) {
                return (
                    <Tooltip arrow={undefined} content={status.text}>
                        {status.text}
                    </Tooltip>
                );
            }

            return <>{status.text}</>;
        }

        if (status?.presence === Users.Presence.Busy) {
            return <Text id="app.status.busy" />;
        }

        if (status?.presence === Users.Presence.Idle) {
            return <Text id="app.status.idle" />;
        }

        if (status?.presence === Users.Presence.Invisible) {
            return <Text id="app.status.offline" />;
        }

        return <Text id="app.status.online" />;
    }

    return <Text id="app.status.offline" />;
}
