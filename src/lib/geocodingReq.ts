import axios from "axios";

export const geocodingReq = async (address: string) => {
        try {
            const resp = await axios.post(
                'https://maponomy2.potterstech.com/api/v3/clients/places/geocode',
                {
                    places: [
                        {
                            wbn: "string",
                            address: address
                        }
                    ]
                },
                {
                    headers: {
                        'x-api-key': 'sXICUfV1igf74kYE1XioAEC_r8ghEzsLS5_ZfhZd',
                    },
                }
            );
            if(resp.data && resp.data.success){
                return {
                    places: resp.data.data.places,
                    outside_places: resp.data.data.outside_places
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };