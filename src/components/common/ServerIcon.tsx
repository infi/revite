import { Server } from "revolt.js/dist/api/objects";
import styled from "styled-components";

import { useContext } from "preact/hooks";

import { AppContext } from "../../context/revoltjs/RevoltClient";
import { useData } from "../../context/revoltjs/hooks";

import { IconBaseProps, ImageIconBase } from "./IconBase";

interface Props extends IconBaseProps<string> {
    server_name?: string;
}

const ServerText = styled.div`
    display: grid;
    padding: 0.2em;
    overflow: hidden;
    border-radius: 50%;
    place-items: center;
    color: var(--foreground);
    background: var(--primary-background);
`;

const fallback = "/assets/group.png";
export default function ServerIcon(
    props: Props & Omit<JSX.HTMLAttributes<HTMLImageElement>, keyof Props>,
) {
    const {
        target,
        attachment,
        size,
        animate,
        server_name,
        children,
        as,
        ...imgProps
    } = props;

    const { iconURL, name } = useData(
        (client) => {
            const server = target ? client.servers.get(target) : undefined;

            return {
                iconURL: client.generateFileURL(
                    server?.icon ?? attachment,
                    { max_side: 256 },
                    animate,
                ),
                name: server?.name,
            };
        },
        [{ key: "servers" }],
        [animate, target, attachment],
    );

    if (typeof iconURL === "undefined") {
        return (
            <ServerText style={{ width: size, height: size }}>
                {(name ?? server_name ?? "")
                    .split(" ")
                    .map((x) => x[0])
                    .filter((x) => typeof x !== "undefined")}
            </ServerText>
        );
    }

    return (
        <ImageIconBase
            {...imgProps}
            width={size}
            height={size}
            src={iconURL}
            loading="lazy"
            aria-hidden="true"
        />
    );
}
