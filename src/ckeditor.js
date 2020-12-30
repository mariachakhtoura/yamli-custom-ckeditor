/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import Mention from './custom-plugins/autocomplete/src/mention';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import InsertImage from './custom-plugins/InsertImage';
// import Autocomplete from './custom-plugins/Autocomplete';
import Direction from 'ckeditor5-direction/src/direction';

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	Alignment,
	InsertImage,
	Mention,
	Direction
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'alignment',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo',
			'insertImage',
			'direction'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	mention: {
		feeds: [
			{
				marker: /\b(\w+)\b$/,
				feed: getFeedItems,
				minimumCharacters: 1
			}
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};

function getFeedItems( queryText ) {
	// As an example of an asynchronous action, return a promise
	// that resolves after a 100ms timeout.
	// This can be a server request or any sort of delayed action.
	return new Promise( resolve => {
		fetch( `https://api.yamli.com/transliterate.ashx?word=${ queryText }&tool=api&account_id=000006&prot=https%3A&hostname=www.yamli.com&path=%2Farabic-keyboard%2F&build=5515&sxhr_id=15`, {
			headers: {
				'Accept-Language': 'en-US,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate, br',
				'Access-Control-Allow-Origin': '*'
			},
			referrer: 'https://www.yamli.com/arabic-keyboard/',
			referrerPolicy: 'no-referrer'
		} ).then( response => response.json() ).then( response => {
			let items;
			const matchedData = response.toString().match( /(?<=\{"data":")(.*?)(?=",")/ );
			if ( matchedData && matchedData.length > 0 ) {
			// const itemObjects = JSON.parse( matchedData[ 0 ] );
				// const rItems = JSON.parse( itemObjects.data ).r;
				const rItems = matchedData[ 0 ];
				const arabicChoices = rItems.match( /[\u0621-\u064A ]+/g );
				const totalChoices = [ queryText, ...arabicChoices ];
				// console.log( arabicChoices );
				resolve( totalChoices );
			} else {
				resolve( [] );
			}
		} );
	} );

	// Filtering function - it uses the `name` and `username` properties of an item to find a match.
	function isItemMatching( item ) {
		// Make the search case-insensitive.
		const searchString = queryText.toLowerCase();

		// Include an item in the search results if the name or username includes the current user input.
		return (
			item.name.toLowerCase().includes( searchString ) ||
        item.id.toLowerCase().includes( searchString )
		);
	}
}
