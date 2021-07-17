import { Servers } from "revolt.js/dist/api/objects";

import styles from "./Panes.module.scss";
import { useContext, useEffect, useState } from "preact/hooks";

import { AppContext } from "../../../context/revoltjs/RevoltClient";
import { useData } from "../../../context/revoltjs/hooks";

interface Props {
    server: Servers.Server;
}

// ! FIXME: bad code :)
export function Members({ server }: Props) {
    const client = useContext(AppContext);
    const [members, setMembers] = useState<Servers.Member[] | undefined>(
        undefined,
    );

    const users = useData(
        (client) => {
            if (!members) return [];

            return client.users
                .mapKeys(members.map((x) => x._id.user))
                .filter((x) => typeof x !== "undefined")
                .map((x) => {
                    return {
                        username: x!.username,
                    };
                });
        },
        [{ key: "users" }],
    );

    useEffect(() => {
        client.servers.members
            .fetchMembers(server._id)
            .then((members) => setMembers(members));
    }, []);

    return (
        <div className={styles.members}>
            <div className={styles.subtitle}>
                {members?.length ?? 0} Members
            </div>
            {members &&
                members.length > 0 &&
                users?.map(
                    (x) =>
                        x && (
                            <div className={styles.member}>
                                <div>@{x.username}</div>
                            </div>
                        ),
                )}
        </div>
    );
}
