import { ListUl, ListCheck } from "@styled-icons/boxicons-regular";
import { XSquare, Share, Group } from "@styled-icons/boxicons-solid";
import { Route, useHistory, useParams } from "react-router-dom";

import { Text } from "preact-i18n";

import RequiresOnline from "../../context/revoltjs/RequiresOnline";
import { useData } from "../../context/revoltjs/hooks";

import Category from "../../components/ui/Category";

import { GenericSettings } from "./GenericSettings";
import { Bans } from "./server/Bans";
import { Invites } from "./server/Invites";
import { Members } from "./server/Members";
import { Overview } from "./server/Overview";
import { Roles } from "./server/Roles";

export default function ServerSettings() {
    const { server } = useParams<{ server: string }>();
    const name = useData(
        (client) => client.servers.get(server)?.name,
        [{ key: "servers" }],
    );
    if (!name) return null;

    const history = useHistory();
    function switchPage(to?: string) {
        if (to) {
            history.replace(`/server/${server}/settings/${to}`);
        } else {
            history.replace(`/server/${server}/settings`);
        }
    }

    return (
        <GenericSettings
            pages={[
                {
                    category: <Category variant="uniform" text={name} />,
                    id: "overview",
                    icon: <ListUl size={20} />,
                    title: (
                        <Text id="app.settings.server_pages.overview.title" />
                    ),
                },
                {
                    id: "members",
                    icon: <Group size={20} />,
                    title: (
                        <Text id="app.settings.server_pages.members.title" />
                    ),
                },
                {
                    id: "invites",
                    icon: <Share size={20} />,
                    title: (
                        <Text id="app.settings.server_pages.invites.title" />
                    ),
                },
                {
                    id: "bans",
                    icon: <XSquare size={20} />,
                    title: <Text id="app.settings.server_pages.bans.title" />,
                },
                {
                    id: "roles",
                    icon: <ListCheck size={20} />,
                    title: <Text id="app.settings.server_pages.roles.title" />,
                    hideTitle: true,
                },
            ]}
            children={[
                <Route path="/server/:server/settings/members">
                    <RequiresOnline>
                        <Members server={server} />
                    </RequiresOnline>
                </Route>,
                <Route path="/server/:server/settings/invites">
                    <RequiresOnline>
                        <Invites server={server} />
                    </RequiresOnline>
                </Route>,
                <Route path="/server/:server/settings/bans">
                    <RequiresOnline>
                        <Bans server={server} />
                    </RequiresOnline>
                </Route>,
                <Route path="/server/:server/settings/roles">
                    <RequiresOnline>
                        <Roles server={server} />
                    </RequiresOnline>
                </Route>,
                <Route path="/">
                    <Overview server={server} />
                </Route>,
            ]}
            category="server_pages"
            switchPage={switchPage}
            defaultPage="overview"
            showExitButton
        />
    );
}
