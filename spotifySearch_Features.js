const apiPrefix = 'https://api.spotify.com/v1';

export default async ({id, token}) => {
    const searchUrl_Features = `${apiPrefix}/audio-features/${id}`; //Get Audio Features for a track, used for tempo value in my case
    // console.log('starting search, searchURL is ' + searchUrl);
    const params = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const res = await fetch(searchUrl_Features, params);
    const jsonObj = await res.json();

    if (!res.ok){
        return [];
    }

    return jsonObj.tempo //only concerned about tempo from this json object for now.
};