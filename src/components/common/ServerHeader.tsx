import { Cog } from "@styled-icons/boxicons-solid";
import { Link } from "react-router-dom";
import { ServerPermission } from "revolt.js/dist/api/permissions";
import styled from "styled-components";

import {
    HookContext,
    useData,
    useServerPermission,
} from "../../context/revoltjs/hooks";

import Header from "../ui/Header";
import IconButton from "../ui/IconButton";

interface Props {
    server: string;
    ctx: HookContext;
}

const ServerName = styled.div`
    flex-grow: 1;
`;

export default function ServerHeader({ server, ctx }: Props) {
    const permissions = useServerPermission(server, ctx);
    const bannerURL = ctx.client.servers.getBannerURL(
        server,
        { width: 480 },
        true,
    );

    const name = useData(
        (client) => client.servers.get(server)!.name,
        [{ key: "servers" }],
    );

    return (
        <Header
            borders
            placement="secondary"
            background={typeof bannerURL !== "undefined"}
            style={{
                background: bannerURL ? `url('${bannerURL}')` : undefined,
            }}>
            <ServerName>{name}</ServerName>
            {(permissions & ServerPermission.ManageServer) > 0 && (
                <div className="actions">
                    <Link to={`/server/${server}/settings`}>
                        <IconButton>
                            <Cog size={24} />
                        </IconButton>
                    </Link>
                </div>
            )}
        </Header>
    );
}
