
import { renderContentPage } from './base-view.js';
import { utils as _ } from '../tools/utils.js';

export async function profileView() {
    await renderContentPage('profile-app');
    const profileApp = document.querySelector('profile-app');
    const id = _.getQueryParams().id;

    if (profileApp.userId == id) return;

    await profileApp.reRender();
}
