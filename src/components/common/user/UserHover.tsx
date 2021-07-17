import styled from "styled-components";

import { useData } from "../../../context/revoltjs/hooks";

import { Children } from "../../../types/Preact";
import Tooltip from "../Tooltip";
import { Username } from "./UserShort";
import UserStatus from "./UserStatus";

interface Props {
    user?: string;
    children: Children;
}

const Base = styled.div`
    display: flex;
    flex-direction: column;

    .username {
        font-size: 13px;
        font-weight: 600;
    }

    .status {
        font-size: 11px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tip {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
        color: var(--secondary-foreground);
    }
`;

export default function UserHover({ user, children }: Props) {
    const username = useData(
        (client) => (user ? client.users.get(user)?.username : undefined),
        [{ key: "users" }],
    );

    return (
        <Tooltip
            placement="right-end"
            content={
                <Base>
                    <Username className="username" username={username} />
                    <span className="status">
                        <UserStatus user_id={user} />
                    </span>
                    {/*<div className="tip"><InfoCircle size={13}/>Right-click on the avatar to access the quick menu</div>*/}
                </Base>
            }>
            {children}
        </Tooltip>
    );
}
