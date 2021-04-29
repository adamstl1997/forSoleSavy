const apiPrefix = 'https://api.spotify.com/v1';

export default async ({offset, limit, q, token,}) => {
    const searchUrl = `${apiPrefix}/search?type=track&limit=${limit}&offset=${offset}&q=${encodeURIComponent(q)}`;
    // console.log('starting search, searchURL is ' + searchUrl);
    const params = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const res = await fetch(searchUrl, params);
    const jsonObj = await res.json();
    //console.log ('the json results returned is \n' + JSON.stringify(jsonObj.id) );

    if (!res.ok){
        return [];
    }

    const { tracks: {items } } = jsonObj;

    return items.map(item => ({
        id: item.id,
        title: item.name,
        artist: item.artists
            ? item.artists[0].name
            : undefined,
        albumname: item.album.name,
        imageUri: item.album.images
            ? item.album.images[0].url
            : undefined
    }));
};