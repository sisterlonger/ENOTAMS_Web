import { defineStore } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

type Tab = {
    name: string;
    link: string;
};

export const TAB_PERSISTENCE_KEYS = {
    TABS: 'tiny-pro::tabs',
    CURRENT: 'tiny-pro::tabs:current',
};

const initTabs = () => {
    const tabs = JSON.parse(
        localStorage.getItem(TAB_PERSISTENCE_KEYS.TABS) ?? '[]',
    ) as Tab[];
    const routes = useRouter()
        .getRoutes()
        .map((route) => route.path);
    //console.log(useRouter().getRoutes());
    const i18n = useRouter().getRoutes();
    return tabs
        .filter((tab) => routes.includes(tab.link))
        .map((item) => {
            const i18route = i18n.filter((route) => route.path === item.link)[0];
            return {
                name: i18route.meta.locale ?? item.name ?? '',
                link: item.link,
            };
        });
};
const initCurrent = () => {
    const current = JSON.parse(
        localStorage.getItem(TAB_PERSISTENCE_KEYS.CURRENT) ?? '{}',
    ) as Tab;
    return current;
};

export const useTabStore = defineStore('tabs', {
    state() {
        return {
            data: initTabs(),
            current: initCurrent(),
        };
    },
    actions: {
        add(item: Tab) {
            if (!item.name) {
                return { ...item };
            }
            if (!this.has(item.name)) {
                this.data.push(item);
            }
            this.current = item;
            localStorage.setItem(
                TAB_PERSISTENCE_KEYS.TABS,
                JSON.stringify(this.data),
            );
            return { ...item };
        },
        set(name: string) {
            this.current = this.getByName(name)[0] ?? null;
            localStorage.setItem(
                TAB_PERSISTENCE_KEYS.CURRENT,
                JSON.stringify(this.current),
            );
            return this.current;
        },
        has(name: string) {
            return this.data.some((tab) => tab.name === name);
        },
        getByName(name: string) {
            return this.data.filter((tab) => tab.name === name);
        },
        getByLink(link: string) {
            return this.data.filter((tab) => tab.link === link);
        },
        delByLink(link: string, endsWith = false) {
            let curName = this.current.name;
            if (this.data.length === 1) {
                return '';
            }
            const idx = this.data.findIndex((tab) =>
                endsWith ? tab.link.endsWith(link) : tab.link === link,
            );
            if (idx === -1) {
                return '';
            }
            const currentIdx = this.data.findIndex(
                (tab) => tab.link === this.current.link,
            );
            const isDeleteSelf = currentIdx === idx;
            const next = this.data[currentIdx + 1];
            const prev = this.data[currentIdx - 1];
            if (isDeleteSelf) {
                curName = next?.name ?? prev?.name;
            }
            this.data.splice(idx, 1);
            localStorage.setItem(
                TAB_PERSISTENCE_KEYS.TABS,
                JSON.stringify(this.data),
            );
            return curName;
        },
    },
});
