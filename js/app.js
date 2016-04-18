'use strict';

var photoMapApp = angular.module('photomap-app', []);

// Color scheme generated at https://coolors.co/app/d7e8ed-8bbeed-5091ba-527d9e-c1c1c1
var fills = {
    JAX: '#8BBEED',
    ROB: '#5091BA',
    BOTH: '#527D9E',
    NOT_TOGETHER: '#D7E8ED',
    DETAIL: '#123456',
    defaultFill: '#FFFFFF'
};

var geographyConfig = {
    borderWidth: '1px',
    borderColor: '#C1C1C1',
    popupOnHover: false,
    highlightOnHover: false,
    hideAntarctica: true,
};

var photoAlbums = [{
    name: 'Engagement',
    fillKey: 'BOTH',
    radius: 25,
    yield: 400,
    date: '1953-08-12',
    latitude: 15.8700,
    longitude: 100.9925,
    imageUrl: 'https://lh3.googleusercontent.com/5rm2Ex8-Z3T3bFPSStDCIYHOdRe2E667FYCperj487IZw0NPsKDZNv7AemOS3KR39F5OiCjSplkOkScUSC5Xa458ZB_-jIh3ZOhTm7x5xyfpbJeax91zuy8CzWTPUlf6CPT-sTMTXBlH6d3Sf_3ykqO1b0jqbg6KegEiDI8qFUszrRD4PFeCU65V6pmbxwOGSdPW5JWfGUbekTWd_17BCONd69X6jiYDnOb5ylmVH-zS6F9K8PJ3UvLj4Nhp_oLsBV1oZwpGCyKWf3GRsmmkzClOr6UP0sxgTk0oiNYMgy9YfYQXZ2pfAKnZtrd5N0ziajr4ZAQ8Jt2efkh1eMBArwLHJSX-AB2XzCC7lee6pJWp6-HgkCBn2fFIRyS2sxYKLPGu-DPgVTrccpNQQ-HpVtTnS5sTY7_adkYRwAQP0fkpMVg2uvC1j_zpmEgqiksU78xlMSHgAmltC7FU4eGUPNneVrXK54v9iaWp12RkverGvKr_DiQ2HOEFmUTk1RYI25tbNBF-oe17ocgcDGKZgwsmNPhnuhN_P1MkAYXhorSzyOBRRMv5ATWjttNEHlM6EO_s_g=w1360-h1022-no',
    linkUrl: 'https://goo.gl/photos/2phDdGbiSFzaxt7U9'
},{
    name: 'Hitched!',
    fillKey: 'BOTH',
    radius: 12,
    yield: 400,
    date: '2015-09-26',
    latitude: 41.8781,
    longitude: -87.6298,
    imageUrl: 'https://lh3.googleusercontent.com/DwYoyJEuHTILZU6ZaH9-z6-K9wInWyL3lSMwWKSXYLWVaFsO-mM0QfkAsi-_a27cdKO2qrk6N8BC_tanzsTBXyoXQw1HSNDQE8zpzGokudaQD4JfboHLNdy80Oiz7NltONd0bxIsW1dOreNV5J8T4cj2ZcR_MPcU3p7mfrZIeWa8zY_hMmZxRgf8DoqUSpNYIbd1pCiwUfSt4vyh8BmP98qiOJxDbr6TDtc5u6MYBaHPc8mOxpYV2HtM5AK8t4-QPrp6YdEVOQvuH7ACjKGXiz_fzGfq0MD5bHyCjUjj2IdlvbLgcjRFGgtb0AridvzOmLqB09zJR8MkDRHJ1jD0Ixe39Y6-Mj3K43jOYA5_pgji8izRFZdHt0ovtK3sbsfZ980a-7T-lO_xYPVlXMfX9r1sA0k2T-hv944sVsIV-2XOOzQvWMxZH_6IrZ5-UmAzaEthyJdq8abLstTwALa-RRFbC3ENtYEXrY2p-t1s-BntlDUA5SxTsRPgurh054_XaYmyh4uaYCd1eyfYvC4TXOYs68a_diDPWdv264mnt2dybArHNDHXGjgwcNzWwzrzXm9wQQ=w1074-h1610-no',
    linkUrl: 'https://goo.gl/photos/bzcZhzBRPBeYeMQN8'
},{
    name: 'Honeymoon',
    fillKey: 'BOTH',
    radius: 25,
    yield: 400,
    date: '2015-09-28',
    latitude: -3.0674,
    longitude: 37.3556,
    imageUrl: 'https://lh3.googleusercontent.com/5rm2Ex8-Z3T3bFPSStDCIYHOdRe2E667FYCperj487IZw0NPsKDZNv7AemOS3KR39F5OiCjSplkOkScUSC5Xa458ZB_-jIh3ZOhTm7x5xyfpbJeax91zuy8CzWTPUlf6CPT-sTMTXBlH6d3Sf_3ykqO1b0jqbg6KegEiDI8qFUszrRD4PFeCU65V6pmbxwOGSdPW5JWfGUbekTWd_17BCONd69X6jiYDnOb5ylmVH-zS6F9K8PJ3UvLj4Nhp_oLsBV1oZwpGCyKWf3GRsmmkzClOr6UP0sxgTk0oiNYMgy9YfYQXZ2pfAKnZtrd5N0ziajr4ZAQ8Jt2efkh1eMBArwLHJSX-AB2XzCC7lee6pJWp6-HgkCBn2fFIRyS2sxYKLPGu-DPgVTrccpNQQ-HpVtTnS5sTY7_adkYRwAQP0fkpMVg2uvC1j_zpmEgqiksU78xlMSHgAmltC7FU4eGUPNneVrXK54v9iaWp12RkverGvKr_DiQ2HOEFmUTk1RYI25tbNBF-oe17ocgcDGKZgwsmNPhnuhN_P1MkAYXhorSzyOBRRMv5ATWjttNEHlM6EO_s_g=w1360-h1022-no',
    linkUrl: 'https://goo.gl/photos/dMRHHoEx8FmSQxLt8'
}];

//basic map config with custom fills, mercator projection
var world = new Datamap({
    scope: 'world',
    element: document.getElementById('world'),
    projection: 'mercator',
    responsive: true,
    fills: fills,
    geographyConfig: geographyConfig,
});

world.bubbles(photoAlbums, {
    borderWidth: 1,
    borderOpacity: 0.5,
    borderColor: '#FFFFFF',
    popupTemplate: function(geography, data) {
        return '<div class="hoverinfo" style="max-width: 25%"><img src="' + data.imageUrl + '" alt="' + data.name + '" /></div>';
    },
    fillOpacity: 0.75,
    animate: true,
    highlightOnHover: true,
    highlightFillColor: '#D7E8ED',
    highlightBorderColor: '#D7E8ED',
    highlightBorderWidth: 2,
    highlightBorderOpacity: 0.5,
    highlightFillOpacity: 0.5,
});

// Redirect to the configured link for that bubble
world.svg.selectAll('.datamaps-bubble').on('click', function(){
    var data = JSON.parse(this.getAttribute("data-info"));  // Using basic javascript to prevent adding a
                                                            // heavier weight library for convenience.
    window.location.href = data.linkUrl;
});

window.addEventListener('resize', function() {
    world.resize();
});