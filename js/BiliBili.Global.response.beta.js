/* README: https://github.com/BiliUniverse */
console.log('📺 BiliBili: 🌐 Global β Response')
const $platform = platform();
function platform() {
    if ("undefined" !== typeof $environment && $environment["surge-version"])
        return "Surge"
    if ("undefined" !== typeof $environment && $environment["stash-version"])
        return "Stash"
    if ("undefined" !== typeof module && !!module.exports) return "Node.js"
    if ("undefined" !== typeof $task) return "Quantumult X"
    if ("undefined" !== typeof $loon) return "Loon"
    if ("undefined" !== typeof $rocket) return "Shadowrocket"
    if ("undefined" !== typeof Egern) return "Egern"
}

/* https://www.lodashjs.com */
class Lodash {
	static name = "Lodash";
	static version = "1.2.2";
	static about() { return console.log(`\n🟧 ${this.name} v${this.version}\n`) };

	static get(object = {}, path = "", defaultValue = undefined) {
		// translate array case to dot case, then split with .
		// a[0].b -> a.0.b -> ['a', '0', 'b']
		if (!Array.isArray(path)) path = this.toPath(path);

		const result = path.reduce((previousValue, currentValue) => {
			return Object(previousValue)[currentValue]; // null undefined get attribute will throwError, Object() can return a object 
		}, object);
		return (result === undefined) ? defaultValue : result;
	}

	static set(object = {}, path = "", value) {
		if (!Array.isArray(path)) path = this.toPath(path);
		path
			.slice(0, -1)
			.reduce(
				(previousValue, currentValue, currentIndex) =>
					(Object(previousValue[currentValue]) === previousValue[currentValue])
						? previousValue[currentValue]
						: previousValue[currentValue] = (/^\d+$/.test(path[currentIndex + 1]) ? [] : {}),
				object
			)[path[path.length - 1]] = value;
		return object
	}

	static unset(object = {}, path = "") {
		if (!Array.isArray(path)) path = this.toPath(path);
		let result = path.reduce((previousValue, currentValue, currentIndex) => {
			if (currentIndex === path.length - 1) {
				delete previousValue[currentValue];
				return true
			}
			return Object(previousValue)[currentValue]
		}, object);
		return result
	}

	static toPath(value) {
		return value.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
	}

	static escape(string) {
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
		};
		return string.replace(/[&<>"']/g, m => map[m])
	};

	static unescape(string) {
		const map = {
			'&amp;': '&',
			'&lt;': '<',
			'&gt;': '>',
			'&quot;': '"',
			'&#39;': "'",
		};
		return string.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m])
	}

}

/* https://developer.mozilla.org/zh-CN/docs/Web/API/Storage/setItem */
class Storage {
	static name = "Storage";
	static version = "1.1.0";
	static about () { return log("", `🟧 ${this.name} v${this.version}`, "") };
	static data = null;
	static dataFile = 'box.dat';
	static #nameRegex = /^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;

    static getItem(keyName = new String, defaultValue = null) {
        let keyValue = defaultValue;
        // 如果以 @
		switch (keyName.startsWith('@')) {
			case true:
				const { key, path } = keyName.match(this.#nameRegex)?.groups;
				//log(`1: ${key}, ${path}`);
				keyName = key;
				let value = this.getItem(keyName, {});
				//log(`2: ${JSON.stringify(value)}`)
				if (typeof value !== "object") value = {};
				//log(`3: ${JSON.stringify(value)}`)
				keyValue = Lodash.get(value, path);
				//log(`4: ${JSON.stringify(keyValue)}`)
				try {
					keyValue = JSON.parse(keyValue);
				} catch (e) {
					// do nothing
				}				//log(`5: ${JSON.stringify(keyValue)}`)
				break;
			default:
				switch ($platform) {
					case 'Surge':
					case 'Loon':
					case 'Stash':
					case 'Egern':
					case 'Shadowrocket':
						keyValue = $persistentStore.read(keyName);
						break;
					case 'Quantumult X':
						keyValue = $prefs.valueForKey(keyName);
						break;
					case 'Node.js':
						this.data = this.#loaddata(this.dataFile);
						keyValue = this.data?.[keyName];
						break;
					default:
						keyValue = this.data?.[keyName] || null;
						break;
				}				try {
					keyValue = JSON.parse(keyValue);
				} catch (e) {
					// do nothing
				}				break;
		}		return keyValue ?? defaultValue;
    };

	static setItem(keyName = new String, keyValue = new String) {
		let result = false;
		//log(`0: ${typeof keyValue}`);
		switch (typeof keyValue) {
			case "object":
				keyValue = JSON.stringify(keyValue);
				break;
			default:
				keyValue = String(keyValue);
				break;
		}		switch (keyName.startsWith('@')) {
			case true:
				const { key, path } = keyName.match(this.#nameRegex)?.groups;
				//log(`1: ${key}, ${path}`);
				keyName = key;
				let value = this.getItem(keyName, {});
				//log(`2: ${JSON.stringify(value)}`)
				if (typeof value !== "object") value = {};
				//log(`3: ${JSON.stringify(value)}`)
				Lodash.set(value, path, keyValue);
				//log(`4: ${JSON.stringify(value)}`)
				result = this.setItem(keyName, value);
				//log(`5: ${result}`)
				break;
			default:
				switch ($platform) {
					case 'Surge':
					case 'Loon':
					case 'Stash':
					case 'Egern':
					case 'Shadowrocket':
						result = $persistentStore.write(keyValue, keyName);
						break;
					case 'Quantumult X':
						result =$prefs.setValueForKey(keyValue, keyName);
						break;
					case 'Node.js':
						this.data = this.#loaddata(this.dataFile);
						this.data[keyName] = keyValue;
						this.#writedata(this.dataFile);
						result = true;
						break;
					default:
						result = this.data?.[keyName] || null;
						break;
				}				break;
		}		return result;
	};

    static removeItem(keyName){
		let result = false;
		switch (keyName.startsWith('@')) {
			case true:
				const { key, path } = keyName.match(this.#nameRegex)?.groups;
				keyName = key;
				let value = this.getItem(keyName);
				if (typeof value !== "object") value = {};
				keyValue = Lodash.unset(value, path);
				result = this.setItem(keyName, value);
				break;
			default:
				switch ($platform) {
					case 'Surge':
					case 'Loon':
					case 'Stash':
					case 'Egern':
					case 'Shadowrocket':
						result = false;
						break;
					case 'Quantumult X':
						result = $prefs.removeValueForKey(keyName);
						break;
					case 'Node.js':
						result = false;
						break;
					default:
						result = false;
						break;
				}				break;
		}		return result;
    }

    static clear() {
		let result = false;
		switch ($platform) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
				result = false;
				break;
			case 'Quantumult X':
				result = $prefs.removeAllValues();
				break;
			case 'Node.js':
				result = false;
				break;
			default:
				result = false;
				break;
		}		return result;
    }

	static #loaddata(dataFile) {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				dataFile
			);
			const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
			const isRootDirDataFile =
				!isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
			if (isCurDirDataFile || isRootDirDataFile) {
				const datPath = isCurDirDataFile
					? curDirDataFilePath
					: rootDirDataFilePath;
				try {
					return JSON.parse(this.fs.readFileSync(datPath))
				} catch (e) {
					return {}
				}
			} else return {}
		} else return {}
	}

	static #writedata(dataFile = this.dataFile) {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				dataFile
			);
			const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
			const isRootDirDataFile =
				!isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
			const jsondata = JSON.stringify(this.data);
			if (isCurDirDataFile) {
				this.fs.writeFileSync(curDirDataFilePath, jsondata);
			} else if (isRootDirDataFile) {
				this.fs.writeFileSync(rootDirDataFilePath, jsondata);
			} else {
				this.fs.writeFileSync(curDirDataFilePath, jsondata);
			}
		}
	};

}

function logError(error) {
    switch ($platform) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Egern":
        case "Shadowrocket":
        case "Quantumult X":
        default:
            log("", `❗️执行错误!`, error, "");
            break
        case "Node.js":
            log("", `❗️执行错误!`, error.stack, "");
            break
    }}

function done(object = {}) {
    switch ($platform) {
        case "Surge":
            if (object.policy) Lodash.set(object, "headers.X-Surge-Policy", object.policy);
            log("", `🚩 执行结束! 🕛 ${(new Date().getTime() / 1000 - $script.startTime)} 秒`, "");
            $done(object);
            break;
        case "Loon":
            if (object.policy) object.node = object.policy;
            log("", `🚩 执行结束! 🕛 ${(new Date() - $script.startTime) / 1000} 秒`, "");
            $done(object);
            break;
        case "Stash":
            if (object.policy) Lodash.set(object, "headers.X-Stash-Selected-Proxy", encodeURI(object.policy));
            log("", `🚩 执行结束! 🕛 ${(new Date() - $script.startTime) / 1000} 秒`, "");
            $done(object);
            break;
        case "Egern":
            log("", `🚩 执行结束!`, "");
            $done(object);
            break;
        case "Shadowrocket":
        default:
            log("", `🚩 执行结束!`, "");
            $done(object);
            break;
        case "Quantumult X":
            if (object.policy) Lodash.set(object, "opts.policy", object.policy);
            // 移除不可写字段
            delete object["auto-redirect"];
            delete object["auto-cookie"];
            delete object["binary-mode"];
            delete object.charset;
            delete object.host;
            delete object.insecure;
            delete object.method; // 1.4.x 不可写
            delete object.opt; // $task.fetch() 参数, 不可写
            delete object.path; // 可写, 但会与 url 冲突
            delete object.policy;
            delete object["policy-descriptor"];
            delete object.scheme;
            delete object.sessionIndex;
            delete object.statusCode;
            delete object.timeout;
            if (object.body instanceof ArrayBuffer) {
                object.bodyBytes = object.body;
                delete object.body;
            } else if (ArrayBuffer.isView(object.body)) {
                object.bodyBytes = object.body.buffer.slice(object.body.byteOffset, object.body.byteLength + object.body.byteOffset);
                delete object.body;
            } else if (object.body) delete object.bodyBytes;
            log("", `🚩 执行结束!`, "");
            $done(object);
            break;
        case "Node.js":
            log("", `🚩 执行结束!`, "");
            process.exit(1);
            break;
    }
}

const log = (...logs) => console.log(logs.join("\n"));

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED$1               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH$1    = 3;
const MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS$1      = 256;
/* number of literal bytes 0..255 */

const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES$1       = 30;
/* number of distance codes */

const BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

const MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init$1 = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block$1(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally$1 = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

var _tr_init_1  = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1  = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants$2 = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_MEM_ERROR:       -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;




/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS$1 = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let HASH = HASH_ZLIB;


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH$3) ||
                        flush === Z_NO_FLUSH$2 ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};


/* ========================================================================= */
const deflate$2 = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$3)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$3;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$3;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK$1) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$3;
      }
    }
  }

  if (flush !== Z_FINISH$3) { return Z_OK$3; }
  if (s.wrap <= 0) { return Z_STREAM_END$3; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
var flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};

var common = {
	assign: assign,
	flattenChunks: flattenChunks
};

// String encode/decode helpers


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
var buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

const toString$1 = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate$1(options) {
  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED$1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = deflate_1$2.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}


var Deflate_1$1 = Deflate$1;
var deflate_2 = deflate$1;
var deflateRaw_1$1 = deflateRaw$1;
var gzip_1$1 = gzip$1;
var constants$1 = constants$2;

var deflate_1$1 = {
	Deflate: Deflate_1$1,
	deflate: deflate_2,
	deflateRaw: deflateRaw_1$1,
	gzip: gzip_1$1,
	constants: constants$1
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
const BAD$1 = 16209;       /* got a data error -- remain here until reset */
const TYPE$1 = 16191;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
var inffast = function inflate_fast(strm, start) {
  let _in;                    /* local strm.input */
  let last;                   /* have enough input while in < last */
  let _out;                   /* local strm.output */
  let beg;                    /* inflate()'s initial strm.output */
  let end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  let dmax;                   /* maximum distance from zlib header */
//#endif
  let wsize;                  /* window size or zero if not using window */
  let whave;                  /* valid bytes in the window */
  let wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  let s_window;               /* allocated sliding window, if wsize != 0 */
  let hold;                   /* local strm.hold */
  let bits;                   /* local strm.bits */
  let lcode;                  /* local strm.lencode */
  let dcode;                  /* local strm.distcode */
  let lmask;                  /* mask for first level of length codes */
  let dmask;                  /* mask for first level of distance codes */
  let here;                   /* retrieved table entry */
  let op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  let len;                    /* match length, unused bytes */
  let dist;                   /* match distance */
  let from;                   /* where to copy match from */
  let from_source;


  let input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  const state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;

const lbase = new Uint16Array([ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
]);

const lext = new Uint8Array([ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
]);

const dbase = new Uint16Array([ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
]);

const dext = new Uint8Array([ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
]);

const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
{
  const bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  let len = 0;               /* a code's length in bits */
  let sym = 0;               /* index of code symbols */
  let min = 0, max = 0;          /* minimum and maximum code lengths */
  let root = 0;              /* number of index bits for root table */
  let curr = 0;              /* number of index bits for current table */
  let drop = 0;              /* code bits to drop for sub-table */
  let left = 0;                   /* number of prefix codes available */
  let used = 0;              /* code entries in table used */
  let huff = 0;              /* Huffman code */
  let incr;              /* for incrementing code, index */
  let fill;              /* index for replicating entries */
  let low;               /* low bits for current root entry */
  let mask;              /* mask for low root bits */
  let next;             /* next available space in table */
  let base = null;     /* base value table to use */
//  let shoextra;    /* extra bits table to use */
  let match;                  /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null;

  let here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work;    /* dummy value--not used */
    match = 20;

  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    match = 0;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


var inftrees = inflate_table;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.






const CODES = 0;
const LENS = 1;
const DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES,
  Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;


/* STATES ====================================================================*/
/* ===========================================================================*/


const    HEAD = 16180;       /* i: waiting for magic header */
const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
const    TIME = 16182;       /* i: waiting for modification time (gzip) */
const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
const    DICTID = 16189;    /* i: waiting for dictionary check value */
const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
const        LENLENS = 16197;   /* i: waiting for code length code lengths */
const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
const            LEN = 16200;       /* i: waiting for length/lit/eob code */
const            LENEXT = 16201;    /* i: waiting for length extra bits */
const            DIST = 16202;      /* i: waiting for distance code */
const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
const            MATCH = 16204;     /* o: waiting for output space to copy string */
const            LIT = 16205;       /* o: waiting for output space to write literal */
const    CHECK = 16206;     /* i: waiting for 32-bit check value */
const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
const    DONE = 16208;      /* finished check, done -- remain here until reset */
const    BAD = 16209;       /* got a data error -- remain here until reset */
const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_WBITS = MAX_WBITS;


const zswap32 = (q) => {

  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
};


function InflateState() {
  this.strm = null;           /* pointer back to this zlib stream */
  this.mode = 0;              /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new Uint16Array(320); /* temporary storage for code lengths */
  this.work = new Uint16Array(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}


const inflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm ||
    state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};


const inflateResetKeep = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$1;
};


const inflateReset = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

};


const inflateReset2 = (strm, windowBits) => {
  let wrap;

  /* get the state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};


const inflateInit2 = (strm, windowBits) => {

  if (!strm) { return Z_STREAM_ERROR$1; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  const state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.strm = strm;
  state.window = null/*Z_NULL*/;
  state.mode = HEAD;     /* to pass state test in inflateReset2() */
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
};


const inflateInit = (strm) => {

  return inflateInit2(strm, DEF_WBITS);
};


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
let virgin = true;

let lenfix, distfix; // We have no pointers in JS, so keep tables separate


const fixedtables = (state) => {

  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);

    /* literal/length table */
    let sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
const updatewindow = (strm, src, end, copy) => {

  let dist;
  const state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new Uint8Array(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
};


const inflate$2 = (strm, flush) => {

  let state;
  let input, output;          // input/output buffers
  let next;                   /* next input INDEX */
  let put;                    /* next output INDEX */
  let have, left;             /* available input and output */
  let hold;                   /* bit buffer */
  let bits;                   /* bits in bit buffer */
  let _in, _out;              /* save starting available input and output */
  let copy;                   /* number of stored or match bytes to copy */
  let from;                   /* where to copy match bytes from */
  let from_source;
  let here = 0;               /* current decoding table entry */
  let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //let last;                   /* parent table entry */
  let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  let len;                    /* length to copy for repeats, bits to drop */
  let ret;                    /* return code */
  const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
  let opts;

  let n; // temporary variable for NEED_BITS

  const order = /* permutation of code lengths */
    new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


  if (inflateStateCheck(strm) || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$1;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          if (state.wbits === 0) {
            state.wbits = 15;
          }
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        if (len > 15 || len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        // !!! pako patch. Force use `options.windowBits` if passed.
        // Required to always use max window size by default.
        state.dmax = 1 << state.wbits;
        //state.dmax = 1 << len;

        state.flags = 0;               /* indicate zlib header */
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32_1(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Uint8Array(state.head.extra_len);
              }
              state.head.extra.set(
                input.subarray(
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  next + copy
                ),
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT$1;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          output.set(input.subarray(next, next + copy), put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inffast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if ((state.wrap & 4) && _out) {
            strm.adler = state.check =
                /*UPDATE_CHECK(state.check, put - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$1;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR$1;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH$1))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if ((state.wrap & 4) && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};


const inflateEnd = (strm) => {

  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }

  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};


const inflateGetHeader = (strm, head) => {

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK$1;
};


const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;

  let state;
  let dictid;
  let ret;

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK$1;
};


var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/

var inflate_1$2 = {
	inflateReset: inflateReset_1,
	inflateReset2: inflateReset2_1,
	inflateResetKeep: inflateResetKeep_1,
	inflateInit: inflateInit_1,
	inflateInit2: inflateInit2_1,
	inflate: inflate_2$1,
	inflateEnd: inflateEnd_1,
	inflateGetHeader: inflateGetHeader_1,
	inflateSetDictionary: inflateSetDictionary_1,
	inflateInfo: inflateInfo
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

var gzheader = GZheader;

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR
} = constants$2;

/* ===========================================================================*/


/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ''
  }, options || {});

  const opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new zstream();
  this.strm.avail_out = 0;

  let status  = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }

  this.header = new gzheader();

  inflate_1$2.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;

  if (this.ended) return false;

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = inflate_1$2.inflate(strm, _flush_mode);

    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);

      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        // Replace code with more verbose
        status = Z_NEED_DICT;
      }
    }

    // Skip snyc markers if more data follows and not raw mode
    while (strm.avail_in > 0 &&
           status === Z_STREAM_END &&
           strm.state.wrap > 0 &&
           data[strm.next_in] !== 0)
    {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }

    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }

    // Remember real `avail_out` value, because we may patch out buffer content
    // to align utf8 strings boundaries.
    last_avail_out = strm.avail_out;

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {

        if (this.options.to === 'string') {

          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail & realign counters
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

          this.onData(utf8str);

        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }

    // Must repeat iteration if out buffer is full
    if (status === Z_OK && last_avail_out === 0) continue;

    // Finalize if end of stream reached.
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);

  inflator.push(input);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) throw inflator.msg || messages[inflator.err];

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return inflate$1(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


var Inflate_1$1 = Inflate$1;
var inflate_2 = inflate$1;
var inflateRaw_1$1 = inflateRaw$1;
var ungzip$1 = inflate$1;
var constants = constants$2;

var inflate_1$1 = {
	Inflate: Inflate_1$1,
	inflate: inflate_2,
	inflateRaw: inflateRaw_1$1,
	ungzip: ungzip$1,
	constants: constants
};

const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;

const { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;



var Deflate_1 = Deflate;
var deflate_1 = deflate;
var deflateRaw_1 = deflateRaw;
var gzip_1 = gzip;
var Inflate_1 = Inflate;
var inflate_1 = inflate;
var inflateRaw_1 = inflateRaw;
var ungzip_1 = ungzip;
var constants_1 = constants$2;

var pako = {
	Deflate: Deflate_1,
	deflate: deflate_1,
	deflateRaw: deflateRaw_1,
	gzip: gzip_1,
	Inflate: Inflate_1,
	inflate: inflate_1,
	inflateRaw: inflateRaw_1,
	ungzip: ungzip_1,
	constants: constants_1
};

/* https://grpc.io/ */
class GRPC {
    static name = "gRPC";
    static version = "1.0.3";
    static about = () => log("", `🟧 ${this.name} v${this.version}`, "");

    static decode(bytesBody = new Uint8Array([])) {
        log(`☑️ gRPC.decode`, "");
        // 先拆分gRPC校验头和protobuf数据体
        const Header = bytesBody.slice(0, 5);
        let body = bytesBody.slice(5);
        switch (Header[0]) {
            case 0: // unGzip
            default:
                break;
            case 1: // Gzip
                switch ($platform) {
                    case "Surge":
                        body = $utils.ungzip(body);
                        break;
                    default:
                        body = pako.ungzip(body); // 解压缩protobuf数据体
                        break;
                }                Header[0] = 0; // unGzip
                break;
        }        log(`✅ gRPC.decode`, "");
        return body;
    };

    static encode(body = new Uint8Array([]), encoding = "identity") {
        log(`☑️ gRPC.encode`, "");
        // Header: 1位：是否校验数据 （0或者1） + 4位:校验值（数据长度）
        const Header = new Uint8Array(5);
        const Checksum = this.#Checksum(body.length); // 校验值为未压缩情况下的数据长度, 不是压缩后的长度
        Header.set(Checksum, 1); // 1-4位： 校验值(4位)
        switch (encoding) {
            case "gzip":
                Header.set([1], 0); // 0位：Encoding类型，当为1的时候, app会校验1-4位的校验值是否正确
                body = pako.gzip(body);
                break;
            case "identity":
            case undefined:
            default:
                Header.set([0], 0); // 0位：Encoding类型，当为1的时候, app会校验1-4位的校验值是否正确
                break;
        }        const BytesBody = new Uint8Array(Header.length + body.length);
        BytesBody.set(Header, 0); // 0-4位：gRPC校验头
        BytesBody.set(body, 5); // 5-end位：protobuf数据
        log(`✅ gRPC.encode`, "");
        return BytesBody;
    };

	// 计算校验和 (B站为数据本体字节数)
	static #Checksum(num = 0) {
		let array = new ArrayBuffer(4); // an Int32 takes 4 bytes
		let view = new DataView(array);
		// 首位填充计算过的新数据长度
		view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
		return new Uint8Array(array);
	};
}

var Settings$1 = {
	Switch: true
};
var Default = {
	Settings: Settings$1
};

var Default$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Settings: Settings$1,
    default: Default
});

var Settings = {
	Switch: true,
	ForceHost: "1",
	Locales: [
		"CHN",
		"HKG",
		"TWN"
	],
	Proxies: {
		CHN: "DIRECT",
		HKG: "🇭🇰香港",
		MAC: "🇲🇴澳门",
		TWN: "🇹🇼台湾"
	}
};
var Configs = {
	Locale: {
		CHN: "",
		HKG: "（僅限港.*地區）",
		MAC: "（僅限.*澳.*地區）",
		TWN: "（僅限.*台地區）"
	},
	SearchNav: {
		CHN: {
			name: "番剧🇨🇳",
			total: 0,
			pages: 0,
			type: 17
		},
		HKG: {
			name: "动画🇭🇰",
			total: 0,
			pages: 0,
			type: 27
		},
		MAC: {
			name: "动画🇲🇴",
			total: 0,
			pages: 0,
			type: 37
		},
		TWN: {
			name: "动画🇹🇼",
			total: 0,
			pages: 0,
			type: 47
		}
	}
};
var BiliBili_Global = {
	Settings: Settings,
	Configs: Configs
};

var Global = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Configs: Configs,
    Settings: Settings,
    default: BiliBili_Global
});

var Database$1 = Database = {
	"Default": Default$1,
	"Global": Global,
};

/**
 * Get Storage Variables
 * @link https://github.com/NanoCat-Me/utils/blob/main/getStorage.mjs
 * @author VirgilClyne
 * @param {String} key - Persistent Store Key
 * @param {Array} names - Platform Names
 * @param {Object} database - Default Database
 * @return {Object} { Settings, Caches, Configs }
 */
function getStorage(key, names, database) {
    //log(`☑️ getStorage, Get Environment Variables`, "");
    /***************** BoxJs *****************/
    // 包装为局部变量，用完释放内存
    // BoxJs的清空操作返回假值空字符串, 逻辑或操作符会在左侧操作数为假值时返回右侧操作数。
    let BoxJs = Storage.getItem(key, database);
    //log(`🚧 getStorage, Get Environment Variables`, `BoxJs类型: ${typeof BoxJs}`, `BoxJs内容: ${JSON.stringify(BoxJs)}`, "");
    /***************** Argument *****************/
    let Argument = {};
    switch (typeof $argument) {
        case "string":
            let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=").map(i => i.replace(/\"/g, ''))));
            for (let item in arg) Lodash.set(Argument, item, arg[item]);
            break;
        case "object":
            for (let item in $argument) Lodash.set(Argument, item, $argument[item]);
            break;
    }    //log(`✅ getStorage, Get Environment Variables`, `Argument类型: ${typeof Argument}`, `Argument内容: ${JSON.stringify(Argument)}`, "");
    /***************** Store *****************/
    const Store = { Settings: database?.Default?.Settings || {}, Configs: database?.Default?.Configs || {}, Caches: {} };
    if (!Array.isArray(names)) names = [names];
    //log(`🚧 getStorage, Get Environment Variables`, `names类型: ${typeof names}`, `names内容: ${JSON.stringify(names)}`, "");
    for (let name of names) {
        Store.Settings = { ...Store.Settings, ...database?.[name]?.Settings, ...Argument, ...BoxJs?.[name]?.Settings };
        Store.Configs = { ...Store.Configs, ...database?.[name]?.Configs };
        if (BoxJs?.[name]?.Caches && typeof BoxJs?.[name]?.Caches === "string") BoxJs[name].Caches = JSON.parse(BoxJs?.[name]?.Caches);
        Store.Caches = { ...Store.Caches, ...BoxJs?.[name]?.Caches };
    }    //log(`🚧 getStorage, Get Environment Variables`, `Store.Settings类型: ${typeof Store.Settings}`, `Store.Settings: ${JSON.stringify(Store.Settings)}`, "");
    traverseObject(Store.Settings, (key, value) => {
        //log(`🚧 getStorage, traverseObject`, `${key}: ${typeof value}`, `${key}: ${JSON.stringify(value)}`, "");
        if (value === "true" || value === "false") value = JSON.parse(value); // 字符串转Boolean
        else if (typeof value === "string") {
            if (value.includes(",")) value = value.split(",").map(item => string2number(item)); // 字符串转数组转数字
            else value = string2number(value); // 字符串转数字
        }        return value;
    });
    //log(`✅ getStorage, Get Environment Variables`, `Store: ${typeof Store.Caches}`, `Store内容: ${JSON.stringify(Store)}`, "");
    return Store;
    /***************** function *****************/
    function traverseObject(o, c) { for (var t in o) { var n = o[t]; o[t] = "object" == typeof n && null !== n ? traverseObject(n, c) : c(t, n); } return o }
    function string2number(string) { if (string && !isNaN(string)) string = parseInt(string, 10); return string }
}

/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {Object} $ - ENV
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV(name, platforms, database) {
	log(`☑️ Set Environment Variables`, "");
	let { Settings, Caches, Configs } = getStorage(name, platforms, database);
	/***************** Settings *****************/
	if (!Array.isArray(Settings?.Locales)) Settings.Locales = (Settings.Locales) ? [Settings.Locales] : []; // 只有一个选项时，无逗号分隔
	log(`✅ Set Environment Variables, Settings: ${typeof Settings}, Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	if (!Array.isArray(Caches?.ss)) Caches.ss = [];
	if (!Array.isArray(Caches?.ep)) Caches.ep = [];
	//log(`✅ Set Environment Variables, Caches: ${typeof Caches}, Caches内容: ${JSON.stringify(Caches)}`, "");
	Caches.ss = new Map(Caches?.ss ?? []); // Array转Map
	Caches.ep = new Map(Caches?.ep ?? []); // Array转Map
	/***************** Configs *****************/
	return { Settings, Caches, Configs };
}

/**
 * Get the type of a JSON value.
 * Distinguishes between array, null and object.
 */
function typeofJsonValue(value) {
    let t = typeof value;
    if (t == "object") {
        if (Array.isArray(value))
            return "array";
        if (value === null)
            return "null";
    }
    return t;
}
/**
 * Is this a JSON object (instead of an array or null)?
 */
function isJsonObject(value) {
    return value !== null && typeof value == "object" && !Array.isArray(value);
}

// lookup table from base64 character to byte
let encTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
// lookup table from base64 character *code* to byte because lookup by number is fast
let decTable = [];
for (let i = 0; i < encTable.length; i++)
    decTable[encTable[i].charCodeAt(0)] = i;
// support base64url variants
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");
/**
 * Decodes a base64 string to a byte array.
 *
 * - ignores white-space, including line breaks and tabs
 * - allows inner padding (can decode concatenated base64 strings)
 * - does not require padding
 * - understands base64url encoding:
 *   "-" instead of "+",
 *   "_" instead of "/",
 *   no padding
 */
function base64decode(base64Str) {
    // estimate byte size, not accounting for inner padding and whitespace
    let es = base64Str.length * 3 / 4;
    // if (es % 3 !== 0)
    // throw new Error('invalid base64 string');
    if (base64Str[base64Str.length - 2] == '=')
        es -= 2;
    else if (base64Str[base64Str.length - 1] == '=')
        es -= 1;
    let bytes = new Uint8Array(es), bytePos = 0, // position in byte array
    groupPos = 0, // position in base64 group
    b, // current byte
    p = 0 // previous byte
    ;
    for (let i = 0; i < base64Str.length; i++) {
        b = decTable[base64Str.charCodeAt(i)];
        if (b === undefined) {
            // noinspection FallThroughInSwitchStatementJS
            switch (base64Str[i]) {
                case '=':
                    groupPos = 0; // reset state when padding found
                case '\n':
                case '\r':
                case '\t':
                case ' ':
                    continue; // skip white-space, and padding
                default:
                    throw Error(`invalid base64 string.`);
            }
        }
        switch (groupPos) {
            case 0:
                p = b;
                groupPos = 1;
                break;
            case 1:
                bytes[bytePos++] = p << 2 | (b & 48) >> 4;
                p = b;
                groupPos = 2;
                break;
            case 2:
                bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
                p = b;
                groupPos = 3;
                break;
            case 3:
                bytes[bytePos++] = (p & 3) << 6 | b;
                groupPos = 0;
                break;
        }
    }
    if (groupPos == 1)
        throw Error(`invalid base64 string.`);
    return bytes.subarray(0, bytePos);
}
/**
 * Encodes a byte array to a base64 string.
 * Adds padding at the end.
 * Does not insert newlines.
 */
function base64encode(bytes) {
    let base64 = '', groupPos = 0, // position in base64 group
    b, // current byte
    p = 0; // carry over from previous byte
    for (let i = 0; i < bytes.length; i++) {
        b = bytes[i];
        switch (groupPos) {
            case 0:
                base64 += encTable[b >> 2];
                p = (b & 3) << 4;
                groupPos = 1;
                break;
            case 1:
                base64 += encTable[p | b >> 4];
                p = (b & 15) << 2;
                groupPos = 2;
                break;
            case 2:
                base64 += encTable[p | b >> 6];
                base64 += encTable[b & 63];
                groupPos = 0;
                break;
        }
    }
    // padding required?
    if (groupPos) {
        base64 += encTable[p];
        base64 += '=';
        if (groupPos == 1)
            base64 += '=';
    }
    return base64;
}

/**
 * This handler implements the default behaviour for unknown fields.
 * When reading data, unknown fields are stored on the message, in a
 * symbol property.
 * When writing data, the symbol property is queried and unknown fields
 * are serialized into the output again.
 */
var UnknownFieldHandler;
(function (UnknownFieldHandler) {
    /**
     * The symbol used to store unknown fields for a message.
     * The property must conform to `UnknownFieldContainer`.
     */
    UnknownFieldHandler.symbol = Symbol.for("protobuf-ts/unknown");
    /**
     * Store an unknown field during binary read directly on the message.
     * This method is compatible with `BinaryReadOptions.readUnknownField`.
     */
    UnknownFieldHandler.onRead = (typeName, message, fieldNo, wireType, data) => {
        let container = is(message) ? message[UnknownFieldHandler.symbol] : message[UnknownFieldHandler.symbol] = [];
        container.push({ no: fieldNo, wireType, data });
    };
    /**
     * Write unknown fields stored for the message to the writer.
     * This method is compatible with `BinaryWriteOptions.writeUnknownFields`.
     */
    UnknownFieldHandler.onWrite = (typeName, message, writer) => {
        for (let { no, wireType, data } of UnknownFieldHandler.list(message))
            writer.tag(no, wireType).raw(data);
    };
    /**
     * List unknown fields stored for the message.
     * Note that there may be multiples fields with the same number.
     */
    UnknownFieldHandler.list = (message, fieldNo) => {
        if (is(message)) {
            let all = message[UnknownFieldHandler.symbol];
            return fieldNo ? all.filter(uf => uf.no == fieldNo) : all;
        }
        return [];
    };
    /**
     * Returns the last unknown field by field number.
     */
    UnknownFieldHandler.last = (message, fieldNo) => UnknownFieldHandler.list(message, fieldNo).slice(-1)[0];
    const is = (message) => message && Array.isArray(message[UnknownFieldHandler.symbol]);
})(UnknownFieldHandler || (UnknownFieldHandler = {}));
/**
 * Protobuf binary format wire types.
 *
 * A wire type provides just enough information to find the length of the
 * following value.
 *
 * See https://developers.google.com/protocol-buffers/docs/encoding#structure
 */
var WireType;
(function (WireType) {
    /**
     * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
     */
    WireType[WireType["Varint"] = 0] = "Varint";
    /**
     * Used for fixed64, sfixed64, double.
     * Always 8 bytes with little-endian byte order.
     */
    WireType[WireType["Bit64"] = 1] = "Bit64";
    /**
     * Used for string, bytes, embedded messages, packed repeated fields
     *
     * Only repeated numeric types (types which use the varint, 32-bit,
     * or 64-bit wire types) can be packed. In proto3, such fields are
     * packed by default.
     */
    WireType[WireType["LengthDelimited"] = 2] = "LengthDelimited";
    /**
     * Used for groups
     * @deprecated
     */
    WireType[WireType["StartGroup"] = 3] = "StartGroup";
    /**
     * Used for groups
     * @deprecated
     */
    WireType[WireType["EndGroup"] = 4] = "EndGroup";
    /**
     * Used for fixed32, sfixed32, float.
     * Always 4 bytes with little-endian byte order.
     */
    WireType[WireType["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));

// Copyright 2008 Google Inc.  All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Code generated by the Protocol Buffer compiler is owned by the owner
// of the input file used when generating it.  This code is not
// standalone and requires a support library to be linked with it.  This
// support library is itself covered by the above license.
/**
 * Read a 64 bit varint as two JS numbers.
 *
 * Returns tuple:
 * [0]: low bits
 * [0]: high bits
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
 */
function varint64read() {
    let lowBits = 0;
    let highBits = 0;
    for (let shift = 0; shift < 28; shift += 7) {
        let b = this.buf[this.pos++];
        lowBits |= (b & 0x7F) << shift;
        if ((b & 0x80) == 0) {
            this.assertBounds();
            return [lowBits, highBits];
        }
    }
    let middleByte = this.buf[this.pos++];
    // last four bits of the first 32 bit number
    lowBits |= (middleByte & 0x0F) << 28;
    // 3 upper bits are part of the next 32 bit number
    highBits = (middleByte & 0x70) >> 4;
    if ((middleByte & 0x80) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
    }
    for (let shift = 3; shift <= 31; shift += 7) {
        let b = this.buf[this.pos++];
        highBits |= (b & 0x7F) << shift;
        if ((b & 0x80) == 0) {
            this.assertBounds();
            return [lowBits, highBits];
        }
    }
    throw new Error('invalid varint');
}
/**
 * Write a 64 bit varint, given as two JS numbers, to the given bytes array.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/writer.js#L344
 */
function varint64write(lo, hi, bytes) {
    for (let i = 0; i < 28; i = i + 7) {
        const shift = lo >>> i;
        const hasNext = !((shift >>> 7) == 0 && hi == 0);
        const byte = (hasNext ? shift | 0x80 : shift) & 0xFF;
        bytes.push(byte);
        if (!hasNext) {
            return;
        }
    }
    const splitBits = ((lo >>> 28) & 0x0F) | ((hi & 0x07) << 4);
    const hasMoreBits = !((hi >> 3) == 0);
    bytes.push((hasMoreBits ? splitBits | 0x80 : splitBits) & 0xFF);
    if (!hasMoreBits) {
        return;
    }
    for (let i = 3; i < 31; i = i + 7) {
        const shift = hi >>> i;
        const hasNext = !((shift >>> 7) == 0);
        const byte = (hasNext ? shift | 0x80 : shift) & 0xFF;
        bytes.push(byte);
        if (!hasNext) {
            return;
        }
    }
    bytes.push((hi >>> 31) & 0x01);
}
// constants for binary math
const TWO_PWR_32_DBL$1 = (1 << 16) * (1 << 16);
/**
 * Parse decimal string of 64 bit integer value as two JS numbers.
 *
 * Returns tuple:
 * [0]: minus sign?
 * [1]: low bits
 * [2]: high bits
 *
 * Copyright 2008 Google Inc.
 */
function int64fromString(dec) {
    // Check for minus sign.
    let minus = dec[0] == '-';
    if (minus)
        dec = dec.slice(1);
    // Work 6 decimal digits at a time, acting like we're converting base 1e6
    // digits to binary. This is safe to do with floating point math because
    // Number.isSafeInteger(ALL_32_BITS * 1e6) == true.
    const base = 1e6;
    let lowBits = 0;
    let highBits = 0;
    function add1e6digit(begin, end) {
        // Note: Number('') is 0.
        const digit1e6 = Number(dec.slice(begin, end));
        highBits *= base;
        lowBits = lowBits * base + digit1e6;
        // Carry bits from lowBits to highBits
        if (lowBits >= TWO_PWR_32_DBL$1) {
            highBits = highBits + ((lowBits / TWO_PWR_32_DBL$1) | 0);
            lowBits = lowBits % TWO_PWR_32_DBL$1;
        }
    }
    add1e6digit(-24, -18);
    add1e6digit(-18, -12);
    add1e6digit(-12, -6);
    add1e6digit(-6);
    return [minus, lowBits, highBits];
}
/**
 * Format 64 bit integer value (as two JS numbers) to decimal string.
 *
 * Copyright 2008 Google Inc.
 */
function int64toString(bitsLow, bitsHigh) {
    // Skip the expensive conversion if the number is small enough to use the
    // built-in conversions.
    if ((bitsHigh >>> 0) <= 0x1FFFFF) {
        return '' + (TWO_PWR_32_DBL$1 * bitsHigh + (bitsLow >>> 0));
    }
    // What this code is doing is essentially converting the input number from
    // base-2 to base-1e7, which allows us to represent the 64-bit range with
    // only 3 (very large) digits. Those digits are then trivial to convert to
    // a base-10 string.
    // The magic numbers used here are -
    // 2^24 = 16777216 = (1,6777216) in base-1e7.
    // 2^48 = 281474976710656 = (2,8147497,6710656) in base-1e7.
    // Split 32:32 representation into 16:24:24 representation so our
    // intermediate digits don't overflow.
    let low = bitsLow & 0xFFFFFF;
    let mid = (((bitsLow >>> 24) | (bitsHigh << 8)) >>> 0) & 0xFFFFFF;
    let high = (bitsHigh >> 16) & 0xFFFF;
    // Assemble our three base-1e7 digits, ignoring carries. The maximum
    // value in a digit at this step is representable as a 48-bit integer, which
    // can be stored in a 64-bit floating point number.
    let digitA = low + (mid * 6777216) + (high * 6710656);
    let digitB = mid + (high * 8147497);
    let digitC = (high * 2);
    // Apply carries from A to B and from B to C.
    let base = 10000000;
    if (digitA >= base) {
        digitB += Math.floor(digitA / base);
        digitA %= base;
    }
    if (digitB >= base) {
        digitC += Math.floor(digitB / base);
        digitB %= base;
    }
    // Convert base-1e7 digits to base-10, with optional leading zeroes.
    function decimalFrom1e7(digit1e7, needLeadingZeros) {
        let partial = digit1e7 ? String(digit1e7) : '';
        if (needLeadingZeros) {
            return '0000000'.slice(partial.length) + partial;
        }
        return partial;
    }
    return decimalFrom1e7(digitC, /*needLeadingZeros=*/ 0) +
        decimalFrom1e7(digitB, /*needLeadingZeros=*/ digitC) +
        // If the final 1e7 digit didn't need leading zeros, we would have
        // returned via the trivial code path at the top.
        decimalFrom1e7(digitA, /*needLeadingZeros=*/ 1);
}
/**
 * Write a 32 bit varint, signed or unsigned. Same as `varint64write(0, value, bytes)`
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/1b18833f4f2a2f681f4e4a25cdf3b0a43115ec26/js/binary/encoder.js#L144
 */
function varint32write(value, bytes) {
    if (value >= 0) {
        // write value as varint 32
        while (value > 0x7f) {
            bytes.push((value & 0x7f) | 0x80);
            value = value >>> 7;
        }
        bytes.push(value);
    }
    else {
        for (let i = 0; i < 9; i++) {
            bytes.push(value & 127 | 128);
            value = value >> 7;
        }
        bytes.push(1);
    }
}
/**
 * Read an unsigned 32 bit varint.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
 */
function varint32read() {
    let b = this.buf[this.pos++];
    let result = b & 0x7F;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7F) << 7;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7F) << 14;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7F) << 21;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    // Extract only last 4 bits
    b = this.buf[this.pos++];
    result |= (b & 0x0F) << 28;
    for (let readBytes = 5; ((b & 0x80) !== 0) && readBytes < 10; readBytes++)
        b = this.buf[this.pos++];
    if ((b & 0x80) != 0)
        throw new Error('invalid varint');
    this.assertBounds();
    // Result can have 32 bits, convert it to unsigned
    return result >>> 0;
}

let BI;
function detectBi() {
    const dv = new DataView(new ArrayBuffer(8));
    const ok = globalThis.BigInt !== undefined
        && typeof dv.getBigInt64 === "function"
        && typeof dv.getBigUint64 === "function"
        && typeof dv.setBigInt64 === "function"
        && typeof dv.setBigUint64 === "function";
    BI = ok ? {
        MIN: BigInt("-9223372036854775808"),
        MAX: BigInt("9223372036854775807"),
        UMIN: BigInt("0"),
        UMAX: BigInt("18446744073709551615"),
        C: BigInt,
        V: dv,
    } : undefined;
}
detectBi();
function assertBi(bi) {
    if (!bi)
        throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
}
// used to validate from(string) input (when bigint is unavailable)
const RE_DECIMAL_STR = /^-?[0-9]+$/;
// constants for binary math
const TWO_PWR_32_DBL = 0x100000000;
const HALF_2_PWR_32 = 0x080000000;
// base class for PbLong and PbULong provides shared code
class SharedPbLong {
    /**
     * Create a new instance with the given bits.
     */
    constructor(lo, hi) {
        this.lo = lo | 0;
        this.hi = hi | 0;
    }
    /**
     * Is this instance equal to 0?
     */
    isZero() {
        return this.lo == 0 && this.hi == 0;
    }
    /**
     * Convert to a native number.
     */
    toNumber() {
        let result = this.hi * TWO_PWR_32_DBL + (this.lo >>> 0);
        if (!Number.isSafeInteger(result))
            throw new Error("cannot convert to safe number");
        return result;
    }
}
/**
 * 64-bit unsigned integer as two 32-bit values.
 * Converts between `string`, `number` and `bigint` representations.
 */
class PbULong extends SharedPbLong {
    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value) {
        if (BI)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {
                case "string":
                    if (value == "0")
                        return this.ZERO;
                    if (value == "")
                        throw new Error('string is no integer');
                    value = BI.C(value);
                case "number":
                    if (value === 0)
                        return this.ZERO;
                    value = BI.C(value);
                case "bigint":
                    if (!value)
                        return this.ZERO;
                    if (value < BI.UMIN)
                        throw new Error('signed value for ulong');
                    if (value > BI.UMAX)
                        throw new Error('ulong too large');
                    BI.V.setBigUint64(0, value, true);
                    return new PbULong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
            }
        else
            switch (typeof value) {
                case "string":
                    if (value == "0")
                        return this.ZERO;
                    value = value.trim();
                    if (!RE_DECIMAL_STR.test(value))
                        throw new Error('string is no integer');
                    let [minus, lo, hi] = int64fromString(value);
                    if (minus)
                        throw new Error('signed value for ulong');
                    return new PbULong(lo, hi);
                case "number":
                    if (value == 0)
                        return this.ZERO;
                    if (!Number.isSafeInteger(value))
                        throw new Error('number is no integer');
                    if (value < 0)
                        throw new Error('signed value for ulong');
                    return new PbULong(value, value / TWO_PWR_32_DBL);
            }
        throw new Error('unknown value ' + typeof value);
    }
    /**
     * Convert to decimal string.
     */
    toString() {
        return BI ? this.toBigInt().toString() : int64toString(this.lo, this.hi);
    }
    /**
     * Convert to native bigint.
     */
    toBigInt() {
        assertBi(BI);
        BI.V.setInt32(0, this.lo, true);
        BI.V.setInt32(4, this.hi, true);
        return BI.V.getBigUint64(0, true);
    }
}
/**
 * ulong 0 singleton.
 */
PbULong.ZERO = new PbULong(0, 0);
/**
 * 64-bit signed integer as two 32-bit values.
 * Converts between `string`, `number` and `bigint` representations.
 */
class PbLong extends SharedPbLong {
    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value) {
        if (BI)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {
                case "string":
                    if (value == "0")
                        return this.ZERO;
                    if (value == "")
                        throw new Error('string is no integer');
                    value = BI.C(value);
                case "number":
                    if (value === 0)
                        return this.ZERO;
                    value = BI.C(value);
                case "bigint":
                    if (!value)
                        return this.ZERO;
                    if (value < BI.MIN)
                        throw new Error('signed long too small');
                    if (value > BI.MAX)
                        throw new Error('signed long too large');
                    BI.V.setBigInt64(0, value, true);
                    return new PbLong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
            }
        else
            switch (typeof value) {
                case "string":
                    if (value == "0")
                        return this.ZERO;
                    value = value.trim();
                    if (!RE_DECIMAL_STR.test(value))
                        throw new Error('string is no integer');
                    let [minus, lo, hi] = int64fromString(value);
                    if (minus) {
                        if (hi > HALF_2_PWR_32 || (hi == HALF_2_PWR_32 && lo != 0))
                            throw new Error('signed long too small');
                    }
                    else if (hi >= HALF_2_PWR_32)
                        throw new Error('signed long too large');
                    let pbl = new PbLong(lo, hi);
                    return minus ? pbl.negate() : pbl;
                case "number":
                    if (value == 0)
                        return this.ZERO;
                    if (!Number.isSafeInteger(value))
                        throw new Error('number is no integer');
                    return value > 0
                        ? new PbLong(value, value / TWO_PWR_32_DBL)
                        : new PbLong(-value, -value / TWO_PWR_32_DBL).negate();
            }
        throw new Error('unknown value ' + typeof value);
    }
    /**
     * Do we have a minus sign?
     */
    isNegative() {
        return (this.hi & HALF_2_PWR_32) !== 0;
    }
    /**
     * Negate two's complement.
     * Invert all the bits and add one to the result.
     */
    negate() {
        let hi = ~this.hi, lo = this.lo;
        if (lo)
            lo = ~lo + 1;
        else
            hi += 1;
        return new PbLong(lo, hi);
    }
    /**
     * Convert to decimal string.
     */
    toString() {
        if (BI)
            return this.toBigInt().toString();
        if (this.isNegative()) {
            let n = this.negate();
            return '-' + int64toString(n.lo, n.hi);
        }
        return int64toString(this.lo, this.hi);
    }
    /**
     * Convert to native bigint.
     */
    toBigInt() {
        assertBi(BI);
        BI.V.setInt32(0, this.lo, true);
        BI.V.setInt32(4, this.hi, true);
        return BI.V.getBigInt64(0, true);
    }
}
/**
 * long 0 singleton.
 */
PbLong.ZERO = new PbLong(0, 0);

const defaultsRead$1 = {
    readUnknownField: true,
    readerFactory: bytes => new BinaryReader(bytes),
};
/**
 * Make options for reading binary data form partial options.
 */
function binaryReadOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsRead$1), options) : defaultsRead$1;
}
class BinaryReader {
    constructor(buf, textDecoder) {
        this.varint64 = varint64read; // dirty cast for `this`
        /**
         * Read a `uint32` field, an unsigned 32 bit varint.
         */
        this.uint32 = varint32read; // dirty cast for `this` and access to protected `buf`
        this.buf = buf;
        this.len = buf.length;
        this.pos = 0;
        this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder("utf-8", {
            fatal: true,
            ignoreBOM: true,
        });
    }
    /**
     * Reads a tag - field number and wire type.
     */
    tag() {
        let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
        if (fieldNo <= 0 || wireType < 0 || wireType > 5)
            throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
        return [fieldNo, wireType];
    }
    /**
     * Skip one element on the wire and return the skipped data.
     * Supports WireType.StartGroup since v2.0.0-alpha.23.
     */
    skip(wireType) {
        let start = this.pos;
        // noinspection FallThroughInSwitchStatementJS
        switch (wireType) {
            case WireType.Varint:
                while (this.buf[this.pos++] & 0x80) {
                    // ignore
                }
                break;
            case WireType.Bit64:
                this.pos += 4;
            case WireType.Bit32:
                this.pos += 4;
                break;
            case WireType.LengthDelimited:
                let len = this.uint32();
                this.pos += len;
                break;
            case WireType.StartGroup:
                // From descriptor.proto: Group type is deprecated, not supported in proto3.
                // But we must still be able to parse and treat as unknown.
                let t;
                while ((t = this.tag()[1]) !== WireType.EndGroup) {
                    this.skip(t);
                }
                break;
            default:
                throw new Error("cant skip wire type " + wireType);
        }
        this.assertBounds();
        return this.buf.subarray(start, this.pos);
    }
    /**
     * Throws error if position in byte array is out of range.
     */
    assertBounds() {
        if (this.pos > this.len)
            throw new RangeError("premature EOF");
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32() {
        return this.uint32() | 0;
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32() {
        let zze = this.uint32();
        // decode zigzag
        return (zze >>> 1) ^ -(zze & 1);
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64() {
        return new PbLong(...this.varint64());
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64() {
        return new PbULong(...this.varint64());
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64() {
        let [lo, hi] = this.varint64();
        // decode zig zag
        let s = -(lo & 1);
        lo = ((lo >>> 1 | (hi & 1) << 31) ^ s);
        hi = (hi >>> 1 ^ s);
        return new PbLong(lo, hi);
    }
    /**
     * Read a `bool` field, a variant.
     */
    bool() {
        let [lo, hi] = this.varint64();
        return lo !== 0 || hi !== 0;
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32() {
        return this.view.getUint32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32() {
        return this.view.getInt32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64() {
        return new PbULong(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64() {
        return new PbLong(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float() {
        return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double() {
        return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes() {
        let len = this.uint32();
        let start = this.pos;
        this.pos += len;
        this.assertBounds();
        return this.buf.subarray(start, start + len);
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string() {
        return this.textDecoder.decode(this.bytes());
    }
}

/**
 * assert that condition is true or throw error (with message)
 */
function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
const FLOAT32_MAX = 3.4028234663852886e+38, FLOAT32_MIN = -3.4028234663852886e+38, UINT32_MAX = 0xFFFFFFFF, INT32_MAX = 0X7FFFFFFF, INT32_MIN = -0X80000000;
function assertInt32(arg) {
    if (typeof arg !== "number")
        throw new Error('invalid int 32: ' + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
        throw new Error('invalid int 32: ' + arg);
}
function assertUInt32(arg) {
    if (typeof arg !== "number")
        throw new Error('invalid uint 32: ' + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
        throw new Error('invalid uint 32: ' + arg);
}
function assertFloat32(arg) {
    if (typeof arg !== "number")
        throw new Error('invalid float 32: ' + typeof arg);
    if (!Number.isFinite(arg))
        return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
        throw new Error('invalid float 32: ' + arg);
}

const defaultsWrite$1 = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter(),
};
/**
 * Make options for writing binary data form partial options.
 */
function binaryWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsWrite$1), options) : defaultsWrite$1;
}
class BinaryWriter {
    constructor(textEncoder) {
        /**
         * Previous fork states.
         */
        this.stack = [];
        this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
        this.chunks = [];
        this.buf = [];
    }
    /**
     * Return all bytes written and reset this writer.
     */
    finish() {
        this.chunks.push(new Uint8Array(this.buf)); // flush the buffer
        let len = 0;
        for (let i = 0; i < this.chunks.length; i++)
            len += this.chunks[i].length;
        let bytes = new Uint8Array(len);
        let offset = 0;
        for (let i = 0; i < this.chunks.length; i++) {
            bytes.set(this.chunks[i], offset);
            offset += this.chunks[i].length;
        }
        this.chunks = [];
        return bytes;
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork() {
        this.stack.push({ chunks: this.chunks, buf: this.buf });
        this.chunks = [];
        this.buf = [];
        return this;
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join() {
        // get chunk of fork
        let chunk = this.finish();
        // restore previous state
        let prev = this.stack.pop();
        if (!prev)
            throw new Error('invalid state, fork stack empty');
        this.chunks = prev.chunks;
        this.buf = prev.buf;
        // write length of chunk as varint
        this.uint32(chunk.byteLength);
        return this.raw(chunk);
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo, type) {
        return this.uint32((fieldNo << 3 | type) >>> 0);
    }
    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk) {
        if (this.buf.length) {
            this.chunks.push(new Uint8Array(this.buf));
            this.buf = [];
        }
        this.chunks.push(chunk);
        return this;
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value) {
        assertUInt32(value);
        // write value as varint 32, inlined for speed
        while (value > 0x7f) {
            this.buf.push((value & 0x7f) | 0x80);
            value = value >>> 7;
        }
        this.buf.push(value);
        return this;
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value) {
        assertInt32(value);
        varint32write(value, this.buf);
        return this;
    }
    /**
     * Write a `bool` value, a variant.
     */
    bool(value) {
        this.buf.push(value ? 1 : 0);
        return this;
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value) {
        this.uint32(value.byteLength); // write length of chunk as varint
        return this.raw(value);
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value) {
        let chunk = this.textEncoder.encode(value);
        this.uint32(chunk.byteLength); // write length of chunk as varint
        return this.raw(chunk);
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value) {
        assertFloat32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setFloat32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value) {
        let chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setFloat64(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value) {
        assertUInt32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setUint32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value) {
        assertInt32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setInt32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value) {
        assertInt32(value);
        // zigzag encode
        value = ((value << 1) ^ (value >> 31)) >>> 0;
        varint32write(value, this.buf);
        return this;
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value) {
        let chunk = new Uint8Array(8);
        let view = new DataView(chunk.buffer);
        let long = PbLong.from(value);
        view.setInt32(0, long.lo, true);
        view.setInt32(4, long.hi, true);
        return this.raw(chunk);
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value) {
        let chunk = new Uint8Array(8);
        let view = new DataView(chunk.buffer);
        let long = PbULong.from(value);
        view.setInt32(0, long.lo, true);
        view.setInt32(4, long.hi, true);
        return this.raw(chunk);
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value) {
        let long = PbLong.from(value);
        varint64write(long.lo, long.hi, this.buf);
        return this;
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value) {
        let long = PbLong.from(value), 
        // zigzag encode
        sign = long.hi >> 31, lo = (long.lo << 1) ^ sign, hi = ((long.hi << 1) | (long.lo >>> 31)) ^ sign;
        varint64write(lo, hi, this.buf);
        return this;
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value) {
        let long = PbULong.from(value);
        varint64write(long.lo, long.hi, this.buf);
        return this;
    }
}

const defaultsWrite = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0,
}, defaultsRead = {
    ignoreUnknownFields: false,
};
/**
 * Make options for reading JSON data from partial options.
 */
function jsonReadOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsRead), options) : defaultsRead;
}
/**
 * Make options for writing JSON data from partial options.
 */
function jsonWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsWrite), options) : defaultsWrite;
}

/**
 * The symbol used as a key on message objects to store the message type.
 *
 * Note that this is an experimental feature - it is here to stay, but
 * implementation details may change without notice.
 */
const MESSAGE_TYPE = Symbol.for("protobuf-ts/message-type");

/**
 * Converts snake_case to lowerCamelCase.
 *
 * Should behave like protoc:
 * https://github.com/protocolbuffers/protobuf/blob/e8ae137c96444ea313485ed1118c5e43b2099cf1/src/google/protobuf/compiler/java/java_helpers.cc#L118
 */
function lowerCamelCase(snakeCase) {
    let capNext = false;
    const sb = [];
    for (let i = 0; i < snakeCase.length; i++) {
        let next = snakeCase.charAt(i);
        if (next == '_') {
            capNext = true;
        }
        else if (/\d/.test(next)) {
            sb.push(next);
            capNext = true;
        }
        else if (capNext) {
            sb.push(next.toUpperCase());
            capNext = false;
        }
        else if (i == 0) {
            sb.push(next.toLowerCase());
        }
        else {
            sb.push(next);
        }
    }
    return sb.join('');
}

/**
 * Scalar value types. This is a subset of field types declared by protobuf
 * enum google.protobuf.FieldDescriptorProto.Type The types GROUP and MESSAGE
 * are omitted, but the numerical values are identical.
 */
var ScalarType;
(function (ScalarType) {
    // 0 is reserved for errors.
    // Order is weird for historical reasons.
    ScalarType[ScalarType["DOUBLE"] = 1] = "DOUBLE";
    ScalarType[ScalarType["FLOAT"] = 2] = "FLOAT";
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT64 if
    // negative values are likely.
    ScalarType[ScalarType["INT64"] = 3] = "INT64";
    ScalarType[ScalarType["UINT64"] = 4] = "UINT64";
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT32 if
    // negative values are likely.
    ScalarType[ScalarType["INT32"] = 5] = "INT32";
    ScalarType[ScalarType["FIXED64"] = 6] = "FIXED64";
    ScalarType[ScalarType["FIXED32"] = 7] = "FIXED32";
    ScalarType[ScalarType["BOOL"] = 8] = "BOOL";
    ScalarType[ScalarType["STRING"] = 9] = "STRING";
    // Tag-delimited aggregate.
    // Group type is deprecated and not supported in proto3. However, Proto3
    // implementations should still be able to parse the group wire format and
    // treat group fields as unknown fields.
    // TYPE_GROUP = 10,
    // TYPE_MESSAGE = 11,  // Length-delimited aggregate.
    // New in version 2.
    ScalarType[ScalarType["BYTES"] = 12] = "BYTES";
    ScalarType[ScalarType["UINT32"] = 13] = "UINT32";
    // TYPE_ENUM = 14,
    ScalarType[ScalarType["SFIXED32"] = 15] = "SFIXED32";
    ScalarType[ScalarType["SFIXED64"] = 16] = "SFIXED64";
    ScalarType[ScalarType["SINT32"] = 17] = "SINT32";
    ScalarType[ScalarType["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));
/**
 * JavaScript representation of 64 bit integral types. Equivalent to the
 * field option "jstype".
 *
 * By default, protobuf-ts represents 64 bit types as `bigint`.
 *
 * You can change the default behaviour by enabling the plugin parameter
 * `long_type_string`, which will represent 64 bit types as `string`.
 *
 * Alternatively, you can change the behaviour for individual fields
 * with the field option "jstype":
 *
 * ```protobuf
 * uint64 my_field = 1 [jstype = JS_STRING];
 * uint64 other_field = 2 [jstype = JS_NUMBER];
 * ```
 */
var LongType;
(function (LongType) {
    /**
     * Use JavaScript `bigint`.
     *
     * Field option `[jstype = JS_NORMAL]`.
     */
    LongType[LongType["BIGINT"] = 0] = "BIGINT";
    /**
     * Use JavaScript `string`.
     *
     * Field option `[jstype = JS_STRING]`.
     */
    LongType[LongType["STRING"] = 1] = "STRING";
    /**
     * Use JavaScript `number`.
     *
     * Large values will loose precision.
     *
     * Field option `[jstype = JS_NUMBER]`.
     */
    LongType[LongType["NUMBER"] = 2] = "NUMBER";
})(LongType || (LongType = {}));
/**
 * Protobuf 2.1.0 introduced packed repeated fields.
 * Setting the field option `[packed = true]` enables packing.
 *
 * In proto3, all repeated fields are packed by default.
 * Setting the field option `[packed = false]` disables packing.
 *
 * Packed repeated fields are encoded with a single tag,
 * then a length-delimiter, then the element values.
 *
 * Unpacked repeated fields are encoded with a tag and
 * value for each element.
 *
 * `bytes` and `string` cannot be packed.
 */
var RepeatType;
(function (RepeatType) {
    /**
     * The field is not repeated.
     */
    RepeatType[RepeatType["NO"] = 0] = "NO";
    /**
     * The field is repeated and should be packed.
     * Invalid for `bytes` and `string`, they cannot be packed.
     */
    RepeatType[RepeatType["PACKED"] = 1] = "PACKED";
    /**
     * The field is repeated but should not be packed.
     * The only valid repeat type for repeated `bytes` and `string`.
     */
    RepeatType[RepeatType["UNPACKED"] = 2] = "UNPACKED";
})(RepeatType || (RepeatType = {}));
/**
 * Turns PartialFieldInfo into FieldInfo.
 */
function normalizeFieldInfo(field) {
    var _a, _b, _c, _d;
    field.localName = (_a = field.localName) !== null && _a !== void 0 ? _a : lowerCamelCase(field.name);
    field.jsonName = (_b = field.jsonName) !== null && _b !== void 0 ? _b : lowerCamelCase(field.name);
    field.repeat = (_c = field.repeat) !== null && _c !== void 0 ? _c : RepeatType.NO;
    field.opt = (_d = field.opt) !== null && _d !== void 0 ? _d : (field.repeat ? false : field.oneof ? false : field.kind == "message");
    return field;
}

/**
 * Is the given value a valid oneof group?
 *
 * We represent protobuf `oneof` as algebraic data types (ADT) in generated
 * code. But when working with messages of unknown type, the ADT does not
 * help us.
 *
 * This type guard checks if the given object adheres to the ADT rules, which
 * are as follows:
 *
 * 1) Must be an object.
 *
 * 2) Must have a "oneofKind" discriminator property.
 *
 * 3) If "oneofKind" is `undefined`, no member field is selected. The object
 * must not have any other properties.
 *
 * 4) If "oneofKind" is a `string`, the member field with this name is
 * selected.
 *
 * 5) If a member field is selected, the object must have a second property
 * with this name. The property must not be `undefined`.
 *
 * 6) No extra properties are allowed. The object has either one property
 * (no selection) or two properties (selection).
 *
 */
function isOneofGroup(any) {
    if (typeof any != 'object' || any === null || !any.hasOwnProperty('oneofKind')) {
        return false;
    }
    switch (typeof any.oneofKind) {
        case "string":
            if (any[any.oneofKind] === undefined)
                return false;
            return Object.keys(any).length == 2;
        case "undefined":
            return Object.keys(any).length == 1;
        default:
            return false;
    }
}

// noinspection JSMethodCanBeStatic
class ReflectionTypeCheck {
    constructor(info) {
        var _a;
        this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : [];
    }
    prepare() {
        if (this.data)
            return;
        const req = [], known = [], oneofs = [];
        for (let field of this.fields) {
            if (field.oneof) {
                if (!oneofs.includes(field.oneof)) {
                    oneofs.push(field.oneof);
                    req.push(field.oneof);
                    known.push(field.oneof);
                }
            }
            else {
                known.push(field.localName);
                switch (field.kind) {
                    case "scalar":
                    case "enum":
                        if (!field.opt || field.repeat)
                            req.push(field.localName);
                        break;
                    case "message":
                        if (field.repeat)
                            req.push(field.localName);
                        break;
                    case "map":
                        req.push(field.localName);
                        break;
                }
            }
        }
        this.data = { req, known, oneofs: Object.values(oneofs) };
    }
    /**
     * Is the argument a valid message as specified by the
     * reflection information?
     *
     * Checks all field types recursively. The `depth`
     * specifies how deep into the structure the check will be.
     *
     * With a depth of 0, only the presence of fields
     * is checked.
     *
     * With a depth of 1 or more, the field types are checked.
     *
     * With a depth of 2 or more, the members of map, repeated
     * and message fields are checked.
     *
     * Message fields will be checked recursively with depth - 1.
     *
     * The number of map entries / repeated values being checked
     * is < depth.
     */
    is(message, depth, allowExcessProperties = false) {
        if (depth < 0)
            return true;
        if (message === null || message === undefined || typeof message != 'object')
            return false;
        this.prepare();
        let keys = Object.keys(message), data = this.data;
        // if a required field is missing in arg, this cannot be a T
        if (keys.length < data.req.length || data.req.some(n => !keys.includes(n)))
            return false;
        if (!allowExcessProperties) {
            // if the arg contains a key we dont know, this is not a literal T
            if (keys.some(k => !data.known.includes(k)))
                return false;
        }
        // "With a depth of 0, only the presence and absence of fields is checked."
        // "With a depth of 1 or more, the field types are checked."
        if (depth < 1) {
            return true;
        }
        // check oneof group
        for (const name of data.oneofs) {
            const group = message[name];
            if (!isOneofGroup(group))
                return false;
            if (group.oneofKind === undefined)
                continue;
            const field = this.fields.find(f => f.localName === group.oneofKind);
            if (!field)
                return false; // we found no field, but have a kind, something is wrong
            if (!this.field(group[group.oneofKind], field, allowExcessProperties, depth))
                return false;
        }
        // check types
        for (const field of this.fields) {
            if (field.oneof !== undefined)
                continue;
            if (!this.field(message[field.localName], field, allowExcessProperties, depth))
                return false;
        }
        return true;
    }
    field(arg, field, allowExcessProperties, depth) {
        let repeated = field.repeat;
        switch (field.kind) {
            case "scalar":
                if (arg === undefined)
                    return field.opt;
                if (repeated)
                    return this.scalars(arg, field.T, depth, field.L);
                return this.scalar(arg, field.T, field.L);
            case "enum":
                if (arg === undefined)
                    return field.opt;
                if (repeated)
                    return this.scalars(arg, ScalarType.INT32, depth);
                return this.scalar(arg, ScalarType.INT32);
            case "message":
                if (arg === undefined)
                    return true;
                if (repeated)
                    return this.messages(arg, field.T(), allowExcessProperties, depth);
                return this.message(arg, field.T(), allowExcessProperties, depth);
            case "map":
                if (typeof arg != 'object' || arg === null)
                    return false;
                if (depth < 2)
                    return true;
                if (!this.mapKeys(arg, field.K, depth))
                    return false;
                switch (field.V.kind) {
                    case "scalar":
                        return this.scalars(Object.values(arg), field.V.T, depth, field.V.L);
                    case "enum":
                        return this.scalars(Object.values(arg), ScalarType.INT32, depth);
                    case "message":
                        return this.messages(Object.values(arg), field.V.T(), allowExcessProperties, depth);
                }
                break;
        }
        return true;
    }
    message(arg, type, allowExcessProperties, depth) {
        if (allowExcessProperties) {
            return type.isAssignable(arg, depth);
        }
        return type.is(arg, depth);
    }
    messages(arg, type, allowExcessProperties, depth) {
        if (!Array.isArray(arg))
            return false;
        if (depth < 2)
            return true;
        if (allowExcessProperties) {
            for (let i = 0; i < arg.length && i < depth; i++)
                if (!type.isAssignable(arg[i], depth - 1))
                    return false;
        }
        else {
            for (let i = 0; i < arg.length && i < depth; i++)
                if (!type.is(arg[i], depth - 1))
                    return false;
        }
        return true;
    }
    scalar(arg, type, longType) {
        let argType = typeof arg;
        switch (type) {
            case ScalarType.UINT64:
            case ScalarType.FIXED64:
            case ScalarType.INT64:
            case ScalarType.SFIXED64:
            case ScalarType.SINT64:
                switch (longType) {
                    case LongType.BIGINT:
                        return argType == "bigint";
                    case LongType.NUMBER:
                        return argType == "number" && !isNaN(arg);
                    default:
                        return argType == "string";
                }
            case ScalarType.BOOL:
                return argType == 'boolean';
            case ScalarType.STRING:
                return argType == 'string';
            case ScalarType.BYTES:
                return arg instanceof Uint8Array;
            case ScalarType.DOUBLE:
            case ScalarType.FLOAT:
                return argType == 'number' && !isNaN(arg);
            default:
                // case ScalarType.UINT32:
                // case ScalarType.FIXED32:
                // case ScalarType.INT32:
                // case ScalarType.SINT32:
                // case ScalarType.SFIXED32:
                return argType == 'number' && Number.isInteger(arg);
        }
    }
    scalars(arg, type, depth, longType) {
        if (!Array.isArray(arg))
            return false;
        if (depth < 2)
            return true;
        if (Array.isArray(arg))
            for (let i = 0; i < arg.length && i < depth; i++)
                if (!this.scalar(arg[i], type, longType))
                    return false;
        return true;
    }
    mapKeys(map, type, depth) {
        let keys = Object.keys(map);
        switch (type) {
            case ScalarType.INT32:
            case ScalarType.FIXED32:
            case ScalarType.SFIXED32:
            case ScalarType.SINT32:
            case ScalarType.UINT32:
                return this.scalars(keys.slice(0, depth).map(k => parseInt(k)), type, depth);
            case ScalarType.BOOL:
                return this.scalars(keys.slice(0, depth).map(k => k == 'true' ? true : k == 'false' ? false : k), type, depth);
            default:
                return this.scalars(keys, type, depth, LongType.STRING);
        }
    }
}

/**
 * Utility method to convert a PbLong or PbUlong to a JavaScript
 * representation during runtime.
 *
 * Works with generated field information, `undefined` is equivalent
 * to `STRING`.
 */
function reflectionLongConvert(long, type) {
    switch (type) {
        case LongType.BIGINT:
            return long.toBigInt();
        case LongType.NUMBER:
            return long.toNumber();
        default:
            // case undefined:
            // case LongType.STRING:
            return long.toString();
    }
}

/**
 * Reads proto3 messages in canonical JSON format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 */
class ReflectionJsonReader {
    constructor(info) {
        this.info = info;
    }
    prepare() {
        var _a;
        if (this.fMap === undefined) {
            this.fMap = {};
            const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : [];
            for (const field of fieldsInput) {
                this.fMap[field.name] = field;
                this.fMap[field.jsonName] = field;
                this.fMap[field.localName] = field;
            }
        }
    }
    // Cannot parse JSON <type of jsonValue> for <type name>#<fieldName>.
    assert(condition, fieldName, jsonValue) {
        if (!condition) {
            let what = typeofJsonValue(jsonValue);
            if (what == "number" || what == "boolean")
                what = jsonValue.toString();
            throw new Error(`Cannot parse JSON ${what} for ${this.info.typeName}#${fieldName}`);
        }
    }
    /**
     * Reads a message from canonical JSON format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read(input, message, options) {
        this.prepare();
        const oneofsHandled = [];
        for (const [jsonKey, jsonValue] of Object.entries(input)) {
            const field = this.fMap[jsonKey];
            if (!field) {
                if (!options.ignoreUnknownFields)
                    throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${jsonKey}`);
                continue;
            }
            const localName = field.localName;
            // handle oneof ADT
            let target; // this will be the target for the field value, whether it is member of a oneof or not
            if (field.oneof) {
                if (jsonValue === null && (field.kind !== 'enum' || field.T()[0] !== 'google.protobuf.NullValue')) {
                    continue;
                }
                // since json objects are unordered by specification, it is not possible to take the last of multiple oneofs
                if (oneofsHandled.includes(field.oneof))
                    throw new Error(`Multiple members of the oneof group "${field.oneof}" of ${this.info.typeName} are present in JSON.`);
                oneofsHandled.push(field.oneof);
                target = message[field.oneof] = {
                    oneofKind: localName
                };
            }
            else {
                target = message;
            }
            // we have handled oneof above. we just have read the value into `target`.
            if (field.kind == 'map') {
                if (jsonValue === null) {
                    continue;
                }
                // check input
                this.assert(isJsonObject(jsonValue), field.name, jsonValue);
                // our target to put map entries into
                const fieldObj = target[localName];
                // read entries
                for (const [jsonObjKey, jsonObjValue] of Object.entries(jsonValue)) {
                    this.assert(jsonObjValue !== null, field.name + " map value", null);
                    // read value
                    let val;
                    switch (field.V.kind) {
                        case "message":
                            val = field.V.T().internalJsonRead(jsonObjValue, options);
                            break;
                        case "enum":
                            val = this.enum(field.V.T(), jsonObjValue, field.name, options.ignoreUnknownFields);
                            if (val === false)
                                continue;
                            break;
                        case "scalar":
                            val = this.scalar(jsonObjValue, field.V.T, field.V.L, field.name);
                            break;
                    }
                    this.assert(val !== undefined, field.name + " map value", jsonObjValue);
                    // read key
                    let key = jsonObjKey;
                    if (field.K == ScalarType.BOOL)
                        key = key == "true" ? true : key == "false" ? false : key;
                    key = this.scalar(key, field.K, LongType.STRING, field.name).toString();
                    fieldObj[key] = val;
                }
            }
            else if (field.repeat) {
                if (jsonValue === null)
                    continue;
                // check input
                this.assert(Array.isArray(jsonValue), field.name, jsonValue);
                // our target to put array entries into
                const fieldArr = target[localName];
                // read array entries
                for (const jsonItem of jsonValue) {
                    this.assert(jsonItem !== null, field.name, null);
                    let val;
                    switch (field.kind) {
                        case "message":
                            val = field.T().internalJsonRead(jsonItem, options);
                            break;
                        case "enum":
                            val = this.enum(field.T(), jsonItem, field.name, options.ignoreUnknownFields);
                            if (val === false)
                                continue;
                            break;
                        case "scalar":
                            val = this.scalar(jsonItem, field.T, field.L, field.name);
                            break;
                    }
                    this.assert(val !== undefined, field.name, jsonValue);
                    fieldArr.push(val);
                }
            }
            else {
                switch (field.kind) {
                    case "message":
                        if (jsonValue === null && field.T().typeName != 'google.protobuf.Value') {
                            this.assert(field.oneof === undefined, field.name + " (oneof member)", null);
                            continue;
                        }
                        target[localName] = field.T().internalJsonRead(jsonValue, options, target[localName]);
                        break;
                    case "enum":
                        let val = this.enum(field.T(), jsonValue, field.name, options.ignoreUnknownFields);
                        if (val === false)
                            continue;
                        target[localName] = val;
                        break;
                    case "scalar":
                        target[localName] = this.scalar(jsonValue, field.T, field.L, field.name);
                        break;
                }
            }
        }
    }
    /**
     * Returns `false` for unrecognized string representations.
     *
     * google.protobuf.NullValue accepts only JSON `null` (or the old `"NULL_VALUE"`).
     */
    enum(type, json, fieldName, ignoreUnknownFields) {
        if (type[0] == 'google.protobuf.NullValue')
            assert(json === null || json === "NULL_VALUE", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} only accepts null.`);
        if (json === null)
            // we require 0 to be default value for all enums
            return 0;
        switch (typeof json) {
            case "number":
                assert(Number.isInteger(json), `Unable to parse field ${this.info.typeName}#${fieldName}, enum can only be integral number, got ${json}.`);
                return json;
            case "string":
                let localEnumName = json;
                if (type[2] && json.substring(0, type[2].length) === type[2])
                    // lookup without the shared prefix
                    localEnumName = json.substring(type[2].length);
                let enumNumber = type[1][localEnumName];
                if (typeof enumNumber === 'undefined' && ignoreUnknownFields) {
                    return false;
                }
                assert(typeof enumNumber == "number", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} has no value for "${json}".`);
                return enumNumber;
        }
        assert(false, `Unable to parse field ${this.info.typeName}#${fieldName}, cannot parse enum value from ${typeof json}".`);
    }
    scalar(json, type, longType, fieldName) {
        let e;
        try {
            switch (type) {
                // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
                // Either numbers or strings are accepted. Exponent notation is also accepted.
                case ScalarType.DOUBLE:
                case ScalarType.FLOAT:
                    if (json === null)
                        return .0;
                    if (json === "NaN")
                        return Number.NaN;
                    if (json === "Infinity")
                        return Number.POSITIVE_INFINITY;
                    if (json === "-Infinity")
                        return Number.NEGATIVE_INFINITY;
                    if (json === "") {
                        e = "empty string";
                        break;
                    }
                    if (typeof json == "string" && json.trim().length !== json.length) {
                        e = "extra whitespace";
                        break;
                    }
                    if (typeof json != "string" && typeof json != "number") {
                        break;
                    }
                    let float = Number(json);
                    if (Number.isNaN(float)) {
                        e = "not a number";
                        break;
                    }
                    if (!Number.isFinite(float)) {
                        // infinity and -infinity are handled by string representation above, so this is an error
                        e = "too large or small";
                        break;
                    }
                    if (type == ScalarType.FLOAT)
                        assertFloat32(float);
                    return float;
                // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
                case ScalarType.INT32:
                case ScalarType.FIXED32:
                case ScalarType.SFIXED32:
                case ScalarType.SINT32:
                case ScalarType.UINT32:
                    if (json === null)
                        return 0;
                    let int32;
                    if (typeof json == "number")
                        int32 = json;
                    else if (json === "")
                        e = "empty string";
                    else if (typeof json == "string") {
                        if (json.trim().length !== json.length)
                            e = "extra whitespace";
                        else
                            int32 = Number(json);
                    }
                    if (int32 === undefined)
                        break;
                    if (type == ScalarType.UINT32)
                        assertUInt32(int32);
                    else
                        assertInt32(int32);
                    return int32;
                // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
                case ScalarType.INT64:
                case ScalarType.SFIXED64:
                case ScalarType.SINT64:
                    if (json === null)
                        return reflectionLongConvert(PbLong.ZERO, longType);
                    if (typeof json != "number" && typeof json != "string")
                        break;
                    return reflectionLongConvert(PbLong.from(json), longType);
                case ScalarType.FIXED64:
                case ScalarType.UINT64:
                    if (json === null)
                        return reflectionLongConvert(PbULong.ZERO, longType);
                    if (typeof json != "number" && typeof json != "string")
                        break;
                    return reflectionLongConvert(PbULong.from(json), longType);
                // bool:
                case ScalarType.BOOL:
                    if (json === null)
                        return false;
                    if (typeof json !== "boolean")
                        break;
                    return json;
                // string:
                case ScalarType.STRING:
                    if (json === null)
                        return "";
                    if (typeof json !== "string") {
                        e = "extra whitespace";
                        break;
                    }
                    try {
                        encodeURIComponent(json);
                    }
                    catch (e) {
                        e = "invalid UTF8";
                        break;
                    }
                    return json;
                // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
                // Either standard or URL-safe base64 encoding with/without paddings are accepted.
                case ScalarType.BYTES:
                    if (json === null || json === "")
                        return new Uint8Array(0);
                    if (typeof json !== 'string')
                        break;
                    return base64decode(json);
            }
        }
        catch (error) {
            e = error.message;
        }
        this.assert(false, fieldName + (e ? " - " + e : ""), json);
    }
}

/**
 * Writes proto3 messages in canonical JSON format using reflection
 * information.
 *
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 */
class ReflectionJsonWriter {
    constructor(info) {
        var _a;
        this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * Converts the message to a JSON object, based on the field descriptors.
     */
    write(message, options) {
        const json = {}, source = message;
        for (const field of this.fields) {
            // field is not part of a oneof, simply write as is
            if (!field.oneof) {
                let jsonValue = this.field(field, source[field.localName], options);
                if (jsonValue !== undefined)
                    json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
                continue;
            }
            // field is part of a oneof
            const group = source[field.oneof];
            if (group.oneofKind !== field.localName)
                continue; // not selected, skip
            const opt = field.kind == 'scalar' || field.kind == 'enum'
                ? Object.assign(Object.assign({}, options), { emitDefaultValues: true }) : options;
            let jsonValue = this.field(field, group[field.localName], opt);
            assert(jsonValue !== undefined);
            json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
        }
        return json;
    }
    field(field, value, options) {
        let jsonValue = undefined;
        if (field.kind == 'map') {
            assert(typeof value == "object" && value !== null);
            const jsonObj = {};
            switch (field.V.kind) {
                case "scalar":
                    for (const [entryKey, entryValue] of Object.entries(value)) {
                        const val = this.scalar(field.V.T, entryValue, field.name, false, true);
                        assert(val !== undefined);
                        jsonObj[entryKey.toString()] = val; // JSON standard allows only (double quoted) string as property key
                    }
                    break;
                case "message":
                    const messageType = field.V.T();
                    for (const [entryKey, entryValue] of Object.entries(value)) {
                        const val = this.message(messageType, entryValue, field.name, options);
                        assert(val !== undefined);
                        jsonObj[entryKey.toString()] = val; // JSON standard allows only (double quoted) string as property key
                    }
                    break;
                case "enum":
                    const enumInfo = field.V.T();
                    for (const [entryKey, entryValue] of Object.entries(value)) {
                        assert(entryValue === undefined || typeof entryValue == 'number');
                        const val = this.enum(enumInfo, entryValue, field.name, false, true, options.enumAsInteger);
                        assert(val !== undefined);
                        jsonObj[entryKey.toString()] = val; // JSON standard allows only (double quoted) string as property key
                    }
                    break;
            }
            if (options.emitDefaultValues || Object.keys(jsonObj).length > 0)
                jsonValue = jsonObj;
        }
        else if (field.repeat) {
            assert(Array.isArray(value));
            const jsonArr = [];
            switch (field.kind) {
                case "scalar":
                    for (let i = 0; i < value.length; i++) {
                        const val = this.scalar(field.T, value[i], field.name, field.opt, true);
                        assert(val !== undefined);
                        jsonArr.push(val);
                    }
                    break;
                case "enum":
                    const enumInfo = field.T();
                    for (let i = 0; i < value.length; i++) {
                        assert(value[i] === undefined || typeof value[i] == 'number');
                        const val = this.enum(enumInfo, value[i], field.name, field.opt, true, options.enumAsInteger);
                        assert(val !== undefined);
                        jsonArr.push(val);
                    }
                    break;
                case "message":
                    const messageType = field.T();
                    for (let i = 0; i < value.length; i++) {
                        const val = this.message(messageType, value[i], field.name, options);
                        assert(val !== undefined);
                        jsonArr.push(val);
                    }
                    break;
            }
            // add converted array to json output
            if (options.emitDefaultValues || jsonArr.length > 0 || options.emitDefaultValues)
                jsonValue = jsonArr;
        }
        else {
            switch (field.kind) {
                case "scalar":
                    jsonValue = this.scalar(field.T, value, field.name, field.opt, options.emitDefaultValues);
                    break;
                case "enum":
                    jsonValue = this.enum(field.T(), value, field.name, field.opt, options.emitDefaultValues, options.enumAsInteger);
                    break;
                case "message":
                    jsonValue = this.message(field.T(), value, field.name, options);
                    break;
            }
        }
        return jsonValue;
    }
    /**
     * Returns `null` as the default for google.protobuf.NullValue.
     */
    enum(type, value, fieldName, optional, emitDefaultValues, enumAsInteger) {
        if (type[0] == 'google.protobuf.NullValue')
            return !emitDefaultValues && !optional ? undefined : null;
        if (value === undefined) {
            assert(optional);
            return undefined;
        }
        if (value === 0 && !emitDefaultValues && !optional)
            // we require 0 to be default value for all enums
            return undefined;
        assert(typeof value == 'number');
        assert(Number.isInteger(value));
        if (enumAsInteger || !type[1].hasOwnProperty(value))
            // if we don't now the enum value, just return the number
            return value;
        if (type[2])
            // restore the dropped prefix
            return type[2] + type[1][value];
        return type[1][value];
    }
    message(type, value, fieldName, options) {
        if (value === undefined)
            return options.emitDefaultValues ? null : undefined;
        return type.internalJsonWrite(value, options);
    }
    scalar(type, value, fieldName, optional, emitDefaultValues) {
        if (value === undefined) {
            assert(optional);
            return undefined;
        }
        const ed = emitDefaultValues || optional;
        // noinspection FallThroughInSwitchStatementJS
        switch (type) {
            // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
            case ScalarType.INT32:
            case ScalarType.SFIXED32:
            case ScalarType.SINT32:
                if (value === 0)
                    return ed ? 0 : undefined;
                assertInt32(value);
                return value;
            case ScalarType.FIXED32:
            case ScalarType.UINT32:
                if (value === 0)
                    return ed ? 0 : undefined;
                assertUInt32(value);
                return value;
            // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
            // Either numbers or strings are accepted. Exponent notation is also accepted.
            case ScalarType.FLOAT:
                assertFloat32(value);
            case ScalarType.DOUBLE:
                if (value === 0)
                    return ed ? 0 : undefined;
                assert(typeof value == 'number');
                if (Number.isNaN(value))
                    return 'NaN';
                if (value === Number.POSITIVE_INFINITY)
                    return 'Infinity';
                if (value === Number.NEGATIVE_INFINITY)
                    return '-Infinity';
                return value;
            // string:
            case ScalarType.STRING:
                if (value === "")
                    return ed ? '' : undefined;
                assert(typeof value == 'string');
                return value;
            // bool:
            case ScalarType.BOOL:
                if (value === false)
                    return ed ? false : undefined;
                assert(typeof value == 'boolean');
                return value;
            // JSON value will be a decimal string. Either numbers or strings are accepted.
            case ScalarType.UINT64:
            case ScalarType.FIXED64:
                assert(typeof value == 'number' || typeof value == 'string' || typeof value == 'bigint');
                let ulong = PbULong.from(value);
                if (ulong.isZero() && !ed)
                    return undefined;
                return ulong.toString();
            // JSON value will be a decimal string. Either numbers or strings are accepted.
            case ScalarType.INT64:
            case ScalarType.SFIXED64:
            case ScalarType.SINT64:
                assert(typeof value == 'number' || typeof value == 'string' || typeof value == 'bigint');
                let long = PbLong.from(value);
                if (long.isZero() && !ed)
                    return undefined;
                return long.toString();
            // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
            // Either standard or URL-safe base64 encoding with/without paddings are accepted.
            case ScalarType.BYTES:
                assert(value instanceof Uint8Array);
                if (!value.byteLength)
                    return ed ? "" : undefined;
                return base64encode(value);
        }
    }
}

/**
 * Creates the default value for a scalar type.
 */
function reflectionScalarDefault(type, longType = LongType.STRING) {
    switch (type) {
        case ScalarType.BOOL:
            return false;
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
            return reflectionLongConvert(PbULong.ZERO, longType);
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            return reflectionLongConvert(PbLong.ZERO, longType);
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
            return 0.0;
        case ScalarType.BYTES:
            return new Uint8Array(0);
        case ScalarType.STRING:
            return "";
        default:
            // case ScalarType.INT32:
            // case ScalarType.UINT32:
            // case ScalarType.SINT32:
            // case ScalarType.FIXED32:
            // case ScalarType.SFIXED32:
            return 0;
    }
}

/**
 * Reads proto3 messages in binary format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/encoding
 */
class ReflectionBinaryReader {
    constructor(info) {
        this.info = info;
    }
    prepare() {
        var _a;
        if (!this.fieldNoToField) {
            const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : [];
            this.fieldNoToField = new Map(fieldsInput.map(field => [field.no, field]));
        }
    }
    /**
     * Reads a message from binary format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read(reader, message, options, length) {
        this.prepare();
        const end = length === undefined ? reader.len : reader.pos + length;
        while (reader.pos < end) {
            // read the tag and find the field
            const [fieldNo, wireType] = reader.tag(), field = this.fieldNoToField.get(fieldNo);
            if (!field) {
                let u = options.readUnknownField;
                if (u == "throw")
                    throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.info.typeName}`);
                let d = reader.skip(wireType);
                if (u !== false)
                    (u === true ? UnknownFieldHandler.onRead : u)(this.info.typeName, message, fieldNo, wireType, d);
                continue;
            }
            // target object for the field we are reading
            let target = message, repeated = field.repeat, localName = field.localName;
            // if field is member of oneof ADT, use ADT as target
            if (field.oneof) {
                target = target[field.oneof];
                // if other oneof member selected, set new ADT
                if (target.oneofKind !== localName)
                    target = message[field.oneof] = {
                        oneofKind: localName
                    };
            }
            // we have handled oneof above, we just have read the value into `target[localName]`
            switch (field.kind) {
                case "scalar":
                case "enum":
                    let T = field.kind == "enum" ? ScalarType.INT32 : field.T;
                    let L = field.kind == "scalar" ? field.L : undefined;
                    if (repeated) {
                        let arr = target[localName]; // safe to assume presence of array, oneof cannot contain repeated values
                        if (wireType == WireType.LengthDelimited && T != ScalarType.STRING && T != ScalarType.BYTES) {
                            let e = reader.uint32() + reader.pos;
                            while (reader.pos < e)
                                arr.push(this.scalar(reader, T, L));
                        }
                        else
                            arr.push(this.scalar(reader, T, L));
                    }
                    else
                        target[localName] = this.scalar(reader, T, L);
                    break;
                case "message":
                    if (repeated) {
                        let arr = target[localName]; // safe to assume presence of array, oneof cannot contain repeated values
                        let msg = field.T().internalBinaryRead(reader, reader.uint32(), options);
                        arr.push(msg);
                    }
                    else
                        target[localName] = field.T().internalBinaryRead(reader, reader.uint32(), options, target[localName]);
                    break;
                case "map":
                    let [mapKey, mapVal] = this.mapEntry(field, reader, options);
                    // safe to assume presence of map object, oneof cannot contain repeated values
                    target[localName][mapKey] = mapVal;
                    break;
            }
        }
    }
    /**
     * Read a map field, expecting key field = 1, value field = 2
     */
    mapEntry(field, reader, options) {
        let length = reader.uint32();
        let end = reader.pos + length;
        let key = undefined; // javascript only allows number or string for object properties
        let val = undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    if (field.K == ScalarType.BOOL)
                        key = reader.bool().toString();
                    else
                        // long types are read as string, number types are okay as number
                        key = this.scalar(reader, field.K, LongType.STRING);
                    break;
                case 2:
                    switch (field.V.kind) {
                        case "scalar":
                            val = this.scalar(reader, field.V.T, field.V.L);
                            break;
                        case "enum":
                            val = reader.int32();
                            break;
                        case "message":
                            val = field.V.T().internalBinaryRead(reader, reader.uint32(), options);
                            break;
                    }
                    break;
                default:
                    throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) in map entry for ${this.info.typeName}#${field.name}`);
            }
        }
        if (key === undefined) {
            let keyRaw = reflectionScalarDefault(field.K);
            key = field.K == ScalarType.BOOL ? keyRaw.toString() : keyRaw;
        }
        if (val === undefined)
            switch (field.V.kind) {
                case "scalar":
                    val = reflectionScalarDefault(field.V.T, field.V.L);
                    break;
                case "enum":
                    val = 0;
                    break;
                case "message":
                    val = field.V.T().create();
                    break;
            }
        return [key, val];
    }
    scalar(reader, type, longType) {
        switch (type) {
            case ScalarType.INT32:
                return reader.int32();
            case ScalarType.STRING:
                return reader.string();
            case ScalarType.BOOL:
                return reader.bool();
            case ScalarType.DOUBLE:
                return reader.double();
            case ScalarType.FLOAT:
                return reader.float();
            case ScalarType.INT64:
                return reflectionLongConvert(reader.int64(), longType);
            case ScalarType.UINT64:
                return reflectionLongConvert(reader.uint64(), longType);
            case ScalarType.FIXED64:
                return reflectionLongConvert(reader.fixed64(), longType);
            case ScalarType.FIXED32:
                return reader.fixed32();
            case ScalarType.BYTES:
                return reader.bytes();
            case ScalarType.UINT32:
                return reader.uint32();
            case ScalarType.SFIXED32:
                return reader.sfixed32();
            case ScalarType.SFIXED64:
                return reflectionLongConvert(reader.sfixed64(), longType);
            case ScalarType.SINT32:
                return reader.sint32();
            case ScalarType.SINT64:
                return reflectionLongConvert(reader.sint64(), longType);
        }
    }
}

/**
 * Writes proto3 messages in binary format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/encoding
 */
class ReflectionBinaryWriter {
    constructor(info) {
        this.info = info;
    }
    prepare() {
        if (!this.fields) {
            const fieldsInput = this.info.fields ? this.info.fields.concat() : [];
            this.fields = fieldsInput.sort((a, b) => a.no - b.no);
        }
    }
    /**
     * Writes the message to binary format.
     */
    write(message, writer, options) {
        this.prepare();
        for (const field of this.fields) {
            let value, // this will be our field value, whether it is member of a oneof or not
            emitDefault, // whether we emit the default value (only true for oneof members)
            repeated = field.repeat, localName = field.localName;
            // handle oneof ADT
            if (field.oneof) {
                const group = message[field.oneof];
                if (group.oneofKind !== localName)
                    continue; // if field is not selected, skip
                value = group[localName];
                emitDefault = true;
            }
            else {
                value = message[localName];
                emitDefault = false;
            }
            // we have handled oneof above. we just have to honor `emitDefault`.
            switch (field.kind) {
                case "scalar":
                case "enum":
                    let T = field.kind == "enum" ? ScalarType.INT32 : field.T;
                    if (repeated) {
                        assert(Array.isArray(value));
                        if (repeated == RepeatType.PACKED)
                            this.packed(writer, T, field.no, value);
                        else
                            for (const item of value)
                                this.scalar(writer, T, field.no, item, true);
                    }
                    else if (value === undefined)
                        assert(field.opt);
                    else
                        this.scalar(writer, T, field.no, value, emitDefault || field.opt);
                    break;
                case "message":
                    if (repeated) {
                        assert(Array.isArray(value));
                        for (const item of value)
                            this.message(writer, options, field.T(), field.no, item);
                    }
                    else {
                        this.message(writer, options, field.T(), field.no, value);
                    }
                    break;
                case "map":
                    assert(typeof value == 'object' && value !== null);
                    for (const [key, val] of Object.entries(value))
                        this.mapEntry(writer, options, field, key, val);
                    break;
            }
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u === true ? UnknownFieldHandler.onWrite : u)(this.info.typeName, message, writer);
    }
    mapEntry(writer, options, field, key, value) {
        writer.tag(field.no, WireType.LengthDelimited);
        writer.fork();
        // javascript only allows number or string for object properties
        // we convert from our representation to the protobuf type
        let keyValue = key;
        switch (field.K) {
            case ScalarType.INT32:
            case ScalarType.FIXED32:
            case ScalarType.UINT32:
            case ScalarType.SFIXED32:
            case ScalarType.SINT32:
                keyValue = Number.parseInt(key);
                break;
            case ScalarType.BOOL:
                assert(key == 'true' || key == 'false');
                keyValue = key == 'true';
                break;
        }
        // write key, expecting key field number = 1
        this.scalar(writer, field.K, 1, keyValue, true);
        // write value, expecting value field number = 2
        switch (field.V.kind) {
            case 'scalar':
                this.scalar(writer, field.V.T, 2, value, true);
                break;
            case 'enum':
                this.scalar(writer, ScalarType.INT32, 2, value, true);
                break;
            case 'message':
                this.message(writer, options, field.V.T(), 2, value);
                break;
        }
        writer.join();
    }
    message(writer, options, handler, fieldNo, value) {
        if (value === undefined)
            return;
        handler.internalBinaryWrite(value, writer.tag(fieldNo, WireType.LengthDelimited).fork(), options);
        writer.join();
    }
    /**
     * Write a single scalar value.
     */
    scalar(writer, type, fieldNo, value, emitDefault) {
        let [wireType, method, isDefault] = this.scalarInfo(type, value);
        if (!isDefault || emitDefault) {
            writer.tag(fieldNo, wireType);
            writer[method](value);
        }
    }
    /**
     * Write an array of scalar values in packed format.
     */
    packed(writer, type, fieldNo, value) {
        if (!value.length)
            return;
        assert(type !== ScalarType.BYTES && type !== ScalarType.STRING);
        // write tag
        writer.tag(fieldNo, WireType.LengthDelimited);
        // begin length-delimited
        writer.fork();
        // write values without tags
        let [, method,] = this.scalarInfo(type);
        for (let i = 0; i < value.length; i++)
            writer[method](value[i]);
        // end length delimited
        writer.join();
    }
    /**
     * Get information for writing a scalar value.
     *
     * Returns tuple:
     * [0]: appropriate WireType
     * [1]: name of the appropriate method of IBinaryWriter
     * [2]: whether the given value is a default value
     *
     * If argument `value` is omitted, [2] is always false.
     */
    scalarInfo(type, value) {
        let t = WireType.Varint;
        let m;
        let i = value === undefined;
        let d = value === 0;
        switch (type) {
            case ScalarType.INT32:
                m = "int32";
                break;
            case ScalarType.STRING:
                d = i || !value.length;
                t = WireType.LengthDelimited;
                m = "string";
                break;
            case ScalarType.BOOL:
                d = value === false;
                m = "bool";
                break;
            case ScalarType.UINT32:
                m = "uint32";
                break;
            case ScalarType.DOUBLE:
                t = WireType.Bit64;
                m = "double";
                break;
            case ScalarType.FLOAT:
                t = WireType.Bit32;
                m = "float";
                break;
            case ScalarType.INT64:
                d = i || PbLong.from(value).isZero();
                m = "int64";
                break;
            case ScalarType.UINT64:
                d = i || PbULong.from(value).isZero();
                m = "uint64";
                break;
            case ScalarType.FIXED64:
                d = i || PbULong.from(value).isZero();
                t = WireType.Bit64;
                m = "fixed64";
                break;
            case ScalarType.BYTES:
                d = i || !value.byteLength;
                t = WireType.LengthDelimited;
                m = "bytes";
                break;
            case ScalarType.FIXED32:
                t = WireType.Bit32;
                m = "fixed32";
                break;
            case ScalarType.SFIXED32:
                t = WireType.Bit32;
                m = "sfixed32";
                break;
            case ScalarType.SFIXED64:
                d = i || PbLong.from(value).isZero();
                t = WireType.Bit64;
                m = "sfixed64";
                break;
            case ScalarType.SINT32:
                m = "sint32";
                break;
            case ScalarType.SINT64:
                d = i || PbLong.from(value).isZero();
                m = "sint64";
                break;
        }
        return [t, m, i || d];
    }
}

/**
 * Creates an instance of the generic message, using the field
 * information.
 */
function reflectionCreate(type) {
    /**
     * This ternary can be removed in the next major version.
     * The `Object.create()` code path utilizes a new `messagePrototype`
     * property on the `IMessageType` which has this same `MESSAGE_TYPE`
     * non-enumerable property on it. Doing it this way means that we only
     * pay the cost of `Object.defineProperty()` once per `IMessageType`
     * class of once per "instance". The falsy code path is only provided
     * for backwards compatibility in cases where the runtime library is
     * updated without also updating the generated code.
     */
    const msg = type.messagePrototype
        ? Object.create(type.messagePrototype)
        : Object.defineProperty({}, MESSAGE_TYPE, { value: type });
    for (let field of type.fields) {
        let name = field.localName;
        if (field.opt)
            continue;
        if (field.oneof)
            msg[field.oneof] = { oneofKind: undefined };
        else if (field.repeat)
            msg[name] = [];
        else
            switch (field.kind) {
                case "scalar":
                    msg[name] = reflectionScalarDefault(field.T, field.L);
                    break;
                case "enum":
                    // we require 0 to be default value for all enums
                    msg[name] = 0;
                    break;
                case "map":
                    msg[name] = {};
                    break;
            }
    }
    return msg;
}

/**
 * Copy partial data into the target message.
 *
 * If a singular scalar or enum field is present in the source, it
 * replaces the field in the target.
 *
 * If a singular message field is present in the source, it is merged
 * with the target field by calling mergePartial() of the responsible
 * message type.
 *
 * If a repeated field is present in the source, its values replace
 * all values in the target array, removing extraneous values.
 * Repeated message fields are copied, not merged.
 *
 * If a map field is present in the source, entries are added to the
 * target map, replacing entries with the same key. Entries that only
 * exist in the target remain. Entries with message values are copied,
 * not merged.
 *
 * Note that this function differs from protobuf merge semantics,
 * which appends repeated fields.
 */
function reflectionMergePartial(info, target, source) {
    let fieldValue, // the field value we are working with
    input = source, output; // where we want our field value to go
    for (let field of info.fields) {
        let name = field.localName;
        if (field.oneof) {
            const group = input[field.oneof]; // this is the oneof`s group in the source
            if ((group === null || group === void 0 ? void 0 : group.oneofKind) == undefined) { // the user is free to omit
                continue; // we skip this field, and all other members too
            }
            fieldValue = group[name]; // our value comes from the the oneof group of the source
            output = target[field.oneof]; // and our output is the oneof group of the target
            output.oneofKind = group.oneofKind; // always update discriminator
            if (fieldValue == undefined) {
                delete output[name]; // remove any existing value
                continue; // skip further work on field
            }
        }
        else {
            fieldValue = input[name]; // we are using the source directly
            output = target; // we want our field value to go directly into the target
            if (fieldValue == undefined) {
                continue; // skip further work on field, existing value is used as is
            }
        }
        if (field.repeat)
            output[name].length = fieldValue.length; // resize target array to match source array
        // now we just work with `fieldValue` and `output` to merge the value
        switch (field.kind) {
            case "scalar":
            case "enum":
                if (field.repeat)
                    for (let i = 0; i < fieldValue.length; i++)
                        output[name][i] = fieldValue[i]; // not a reference type
                else
                    output[name] = fieldValue; // not a reference type
                break;
            case "message":
                let T = field.T();
                if (field.repeat)
                    for (let i = 0; i < fieldValue.length; i++)
                        output[name][i] = T.create(fieldValue[i]);
                else if (output[name] === undefined)
                    output[name] = T.create(fieldValue); // nothing to merge with
                else
                    T.mergePartial(output[name], fieldValue);
                break;
            case "map":
                // Map and repeated fields are simply overwritten, not appended or merged
                switch (field.V.kind) {
                    case "scalar":
                    case "enum":
                        Object.assign(output[name], fieldValue); // elements are not reference types
                        break;
                    case "message":
                        let T = field.V.T();
                        for (let k of Object.keys(fieldValue))
                            output[name][k] = T.create(fieldValue[k]);
                        break;
                }
                break;
        }
    }
}

/**
 * Determines whether two message of the same type have the same field values.
 * Checks for deep equality, traversing repeated fields, oneof groups, maps
 * and messages recursively.
 * Will also return true if both messages are `undefined`.
 */
function reflectionEquals(info, a, b) {
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    for (let field of info.fields) {
        let localName = field.localName;
        let val_a = field.oneof ? a[field.oneof][localName] : a[localName];
        let val_b = field.oneof ? b[field.oneof][localName] : b[localName];
        switch (field.kind) {
            case "enum":
            case "scalar":
                let t = field.kind == "enum" ? ScalarType.INT32 : field.T;
                if (!(field.repeat
                    ? repeatedPrimitiveEq(t, val_a, val_b)
                    : primitiveEq(t, val_a, val_b)))
                    return false;
                break;
            case "map":
                if (!(field.V.kind == "message"
                    ? repeatedMsgEq(field.V.T(), objectValues(val_a), objectValues(val_b))
                    : repeatedPrimitiveEq(field.V.kind == "enum" ? ScalarType.INT32 : field.V.T, objectValues(val_a), objectValues(val_b))))
                    return false;
                break;
            case "message":
                let T = field.T();
                if (!(field.repeat
                    ? repeatedMsgEq(T, val_a, val_b)
                    : T.equals(val_a, val_b)))
                    return false;
                break;
        }
    }
    return true;
}
const objectValues = Object.values;
function primitiveEq(type, a, b) {
    if (a === b)
        return true;
    if (type !== ScalarType.BYTES)
        return false;
    let ba = a;
    let bb = b;
    if (ba.length !== bb.length)
        return false;
    for (let i = 0; i < ba.length; i++)
        if (ba[i] != bb[i])
            return false;
    return true;
}
function repeatedPrimitiveEq(type, a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (!primitiveEq(type, a[i], b[i]))
            return false;
    return true;
}
function repeatedMsgEq(type, a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (!type.equals(a[i], b[i]))
            return false;
    return true;
}

const baseDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));
/**
 * This standard message type provides reflection-based
 * operations to work with a message.
 */
class MessageType {
    constructor(name, fields, options) {
        this.defaultCheckDepth = 16;
        this.typeName = name;
        this.fields = fields.map(normalizeFieldInfo);
        this.options = options !== null && options !== void 0 ? options : {};
        this.messagePrototype = Object.create(null, Object.assign(Object.assign({}, baseDescriptors), { [MESSAGE_TYPE]: { value: this } }));
        this.refTypeCheck = new ReflectionTypeCheck(this);
        this.refJsonReader = new ReflectionJsonReader(this);
        this.refJsonWriter = new ReflectionJsonWriter(this);
        this.refBinReader = new ReflectionBinaryReader(this);
        this.refBinWriter = new ReflectionBinaryWriter(this);
    }
    create(value) {
        let message = reflectionCreate(this);
        if (value !== undefined) {
            reflectionMergePartial(this, message, value);
        }
        return message;
    }
    /**
     * Clone the message.
     *
     * Unknown fields are discarded.
     */
    clone(message) {
        let copy = this.create();
        reflectionMergePartial(this, copy, message);
        return copy;
    }
    /**
     * Determines whether two message of the same type have the same field values.
     * Checks for deep equality, traversing repeated fields, oneof groups, maps
     * and messages recursively.
     * Will also return true if both messages are `undefined`.
     */
    equals(a, b) {
        return reflectionEquals(this, a, b);
    }
    /**
     * Is the given value assignable to our message type
     * and contains no [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    is(arg, depth = this.defaultCheckDepth) {
        return this.refTypeCheck.is(arg, depth, false);
    }
    /**
     * Is the given value assignable to our message type,
     * regardless of [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    isAssignable(arg, depth = this.defaultCheckDepth) {
        return this.refTypeCheck.is(arg, depth, true);
    }
    /**
     * Copy partial data into the target message.
     */
    mergePartial(target, source) {
        reflectionMergePartial(this, target, source);
    }
    /**
     * Create a new message from binary format.
     */
    fromBinary(data, options) {
        let opt = binaryReadOptions(options);
        return this.internalBinaryRead(opt.readerFactory(data), data.byteLength, opt);
    }
    /**
     * Read a new message from a JSON value.
     */
    fromJson(json, options) {
        return this.internalJsonRead(json, jsonReadOptions(options));
    }
    /**
     * Read a new message from a JSON string.
     * This is equivalent to `T.fromJson(JSON.parse(json))`.
     */
    fromJsonString(json, options) {
        let value = JSON.parse(json);
        return this.fromJson(value, options);
    }
    /**
     * Write the message to canonical JSON value.
     */
    toJson(message, options) {
        return this.internalJsonWrite(message, jsonWriteOptions(options));
    }
    /**
     * Convert the message to canonical JSON string.
     * This is equivalent to `JSON.stringify(T.toJson(t))`
     */
    toJsonString(message, options) {
        var _a;
        let value = this.toJson(message, options);
        return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Write the message to binary format.
     */
    toBinary(message, options) {
        let opt = binaryWriteOptions(options);
        return this.internalBinaryWrite(message, opt.writerFactory(), opt).finish();
    }
    /**
     * This is an internal method. If you just want to read a message from
     * JSON, use `fromJson()` or `fromJsonString()`.
     *
     * Reads JSON value and merges the fields into the target
     * according to protobuf rules. If the target is omitted,
     * a new instance is created first.
     */
    internalJsonRead(json, options, target) {
        if (json !== null && typeof json == "object" && !Array.isArray(json)) {
            let message = target !== null && target !== void 0 ? target : this.create();
            this.refJsonReader.read(json, message, options);
            return message;
        }
        throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(json)}.`);
    }
    /**
     * This is an internal method. If you just want to write a message
     * to JSON, use `toJson()` or `toJsonString().
     *
     * Writes JSON value and returns it.
     */
    internalJsonWrite(message, options) {
        return this.refJsonWriter.write(message, options);
    }
    /**
     * This is an internal method. If you just want to write a message
     * in binary format, use `toBinary()`.
     *
     * Serializes the message in binary format and appends it to the given
     * writer. Returns passed writer.
     */
    internalBinaryWrite(message, writer, options) {
        this.refBinWriter.write(message, writer, options);
        return writer;
    }
    /**
     * This is an internal method. If you just want to read a message from
     * binary data, use `fromBinary()`.
     *
     * Reads data from binary format and merges the fields into
     * the target according to protobuf rules. If the target is
     * omitted, a new instance is created first.
     */
    internalBinaryRead(reader, length, options, target) {
        let message = target !== null && target !== void 0 ? target : this.create();
        this.refBinReader.read(reader, message, options, length);
        return message;
    }
}

/**
 * Turns PartialMethodInfo into MethodInfo.
 */
function normalizeMethodInfo(method, service) {
    var _a, _b, _c;
    let m = method;
    m.service = service;
    m.localName = (_a = m.localName) !== null && _a !== void 0 ? _a : lowerCamelCase(m.name);
    // noinspection PointlessBooleanExpressionJS
    m.serverStreaming = !!m.serverStreaming;
    // noinspection PointlessBooleanExpressionJS
    m.clientStreaming = !!m.clientStreaming;
    m.options = (_b = m.options) !== null && _b !== void 0 ? _b : {};
    m.idempotency = (_c = m.idempotency) !== null && _c !== void 0 ? _c : undefined;
    return m;
}

class ServiceType {
    constructor(typeName, methods, options) {
        this.typeName = typeName;
        this.methods = methods.map(i => normalizeMethodInfo(i, this));
        this.options = options !== null && options !== void 0 ? options : {};
    }
}

// @generated by protobuf-ts 2.9.4 with parameter generate_dependencies,long_type_number,output_javascript
// @generated from protobuf file "google/protobuf/any.proto" (package "google.protobuf", syntax proto3)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
// https://developers.google.com/protocol-buffers/
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// @generated message type with reflection information, may provide speed optimized methods
class Any$Type extends MessageType {
    constructor() {
        super("google.protobuf.Any", [
            { no: 1, name: "type_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    /**
     * Pack the message into a new `Any`.
     *
     * Uses 'type.googleapis.com/full.type.name' as the type URL.
     */
    pack(message, type) {
        return {
            typeUrl: this.typeNameToUrl(type.typeName), value: type.toBinary(message),
        };
    }
    /**
     * Unpack the message from the `Any`.
     */
    unpack(any, type, options) {
        if (!this.contains(any, type))
            throw new Error("Cannot unpack google.protobuf.Any with typeUrl '" + any.typeUrl + "' as " + type.typeName + ".");
        return type.fromBinary(any.value, options);
    }
    /**
     * Does the given `Any` contain a packed message of the given type?
     */
    contains(any, type) {
        if (!any.typeUrl.length)
            return false;
        let wants = typeof type == "string" ? type : type.typeName;
        let has = this.typeUrlToName(any.typeUrl);
        return wants === has;
    }
    /**
     * Convert the message to canonical JSON value.
     *
     * You have to provide the `typeRegistry` option so that the
     * packed message can be converted to JSON.
     *
     * The `typeRegistry` option is also required to read
     * `google.protobuf.Any` from JSON format.
     */
    internalJsonWrite(any, options) {
        if (any.typeUrl === "")
            return {};
        let typeName = this.typeUrlToName(any.typeUrl);
        let opt = jsonWriteOptions(options);
        let type = opt.typeRegistry?.find(t => t.typeName === typeName);
        if (!type)
            throw new globalThis.Error("Unable to convert google.protobuf.Any with typeUrl '" + any.typeUrl + "' to JSON. The specified type " + typeName + " is not available in the type registry.");
        let value = type.fromBinary(any.value, { readUnknownField: false });
        let json = type.internalJsonWrite(value, opt);
        if (typeName.startsWith("google.protobuf.") || !isJsonObject(json))
            json = { value: json };
        json["@type"] = any.typeUrl;
        return json;
    }
    internalJsonRead(json, options, target) {
        if (!isJsonObject(json))
            throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON " + typeofJsonValue(json) + ".");
        if (typeof json["@type"] != "string" || json["@type"] == "")
            return this.create();
        let typeName = this.typeUrlToName(json["@type"]);
        let type = options?.typeRegistry?.find(t => t.typeName == typeName);
        if (!type)
            throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON. The specified type " + typeName + " is not available in the type registry.");
        let value;
        if (typeName.startsWith("google.protobuf.") && json.hasOwnProperty("value"))
            value = type.fromJson(json["value"], options);
        else {
            let copy = Object.assign({}, json);
            delete copy["@type"];
            value = type.fromJson(copy, options);
        }
        if (target === undefined)
            target = this.create();
        target.typeUrl = json["@type"];
        target.value = type.toBinary(value);
        return target;
    }
    typeNameToUrl(name) {
        if (!name.length)
            throw new Error("invalid type name: " + name);
        return "type.googleapis.com/" + name;
    }
    typeUrlToName(url) {
        if (!url.length)
            throw new Error("invalid type url: " + url);
        let slash = url.lastIndexOf("/");
        let name = slash > 0 ? url.substring(slash + 1) : url;
        if (!name.length)
            throw new Error("invalid type url: " + url);
        return name;
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.typeUrl = "";
        message.value = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string type_url */ 1:
                    message.typeUrl = reader.string();
                    break;
                case /* bytes value */ 2:
                    message.value = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string type_url = 1; */
        if (message.typeUrl !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.typeUrl);
        /* bytes value = 2; */
        if (message.value.length)
            writer.tag(2, WireType.LengthDelimited).bytes(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Any
 */
const Any = new Any$Type();

// @generated by protobuf-ts 2.9.4 with parameter generate_dependencies,long_type_number,output_javascript
// @generated from protobuf file "bilibili/pagination/pagination.proto" (package "bilibili.pagination", syntax proto3)
// tslint:disable
// @generated message type with reflection information, may provide speed optimized methods
class FeedPagination$Type extends MessageType {
    constructor() {
        super("bilibili.pagination.FeedPagination", [
            { no: 1, name: "page_size", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "offset", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "is_refresh", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.pageSize = 0;
        message.offset = "";
        message.isRefresh = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 page_size */ 1:
                    message.pageSize = reader.int32();
                    break;
                case /* string offset */ 2:
                    message.offset = reader.string();
                    break;
                case /* bool is_refresh */ 3:
                    message.isRefresh = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 page_size = 1; */
        if (message.pageSize !== 0)
            writer.tag(1, WireType.Varint).int32(message.pageSize);
        /* string offset = 2; */
        if (message.offset !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.offset);
        /* bool is_refresh = 3; */
        if (message.isRefresh !== false)
            writer.tag(3, WireType.Varint).bool(message.isRefresh);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.pagination.FeedPagination
 */
new FeedPagination$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FeedPaginationReply$Type extends MessageType {
    constructor() {
        super("bilibili.pagination.FeedPaginationReply", [
            { no: 1, name: "next_offset", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "prev_offset", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "last_read_offset", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.nextOffset = "";
        message.prevOffset = "";
        message.lastReadOffset = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string next_offset */ 1:
                    message.nextOffset = reader.string();
                    break;
                case /* string prev_offset */ 2:
                    message.prevOffset = reader.string();
                    break;
                case /* string last_read_offset */ 3:
                    message.lastReadOffset = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string next_offset = 1; */
        if (message.nextOffset !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.nextOffset);
        /* string prev_offset = 2; */
        if (message.prevOffset !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.prevOffset);
        /* string last_read_offset = 3; */
        if (message.lastReadOffset !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.lastReadOffset);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.pagination.FeedPaginationReply
 */
new FeedPaginationReply$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Pagination$Type extends MessageType {
    constructor() {
        super("bilibili.pagination.Pagination", [
            { no: 1, name: "page_size", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "next", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.pageSize = 0;
        message.next = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 page_size */ 1:
                    message.pageSize = reader.int32();
                    break;
                case /* string next */ 2:
                    message.next = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 page_size = 1; */
        if (message.pageSize !== 0)
            writer.tag(1, WireType.Varint).int32(message.pageSize);
        /* string next = 2; */
        if (message.next !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.next);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.pagination.Pagination
 */
const Pagination = new Pagination$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PaginationReply$Type extends MessageType {
    constructor() {
        super("bilibili.pagination.PaginationReply", [
            { no: 1, name: "next", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "prev", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.next = "";
        message.prev = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string next */ 1:
                    message.next = reader.string();
                    break;
                case /* string prev */ 2:
                    message.prev = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string next = 1; */
        if (message.next !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.next);
        /* string prev = 2; */
        if (message.prev !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.prev);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.pagination.PaginationReply
 */
new PaginationReply$Type();

// @generated by protobuf-ts 2.9.4 with parameter generate_dependencies,long_type_number,output_javascript
// @generated from protobuf file "bilibili/app/viewunite/common.proto" (package "bilibili.app.viewunite.common", syntax proto3)
// tslint:disable
/**
 *
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.AttentionRelationStatus
 */
var AttentionRelationStatus;
(function (AttentionRelationStatus) {
    /**
     *
     *
     * @generated from protobuf enum value: ARS_NONE = 0;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_NONE"] = 0] = "ARS_NONE";
    /**
     *
     *
     * @generated from protobuf enum value: ARS_N0RELATION = 1;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_N0RELATION"] = 1] = "ARS_N0RELATION";
    /**
     *
     *
     * @generated from protobuf enum value: ARS_FOLLOWHIM = 2;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_FOLLOWHIM"] = 2] = "ARS_FOLLOWHIM";
    /**
     *
     *
     * @generated from protobuf enum value: ARS_FOLLOWME = 3;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_FOLLOWME"] = 3] = "ARS_FOLLOWME";
    /**
     *
     *
     * @generated from protobuf enum value: ARS_BUDDY = 4;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_BUDDY"] = 4] = "ARS_BUDDY";
    /**
     *
     *
     * @generated from protobuf enum value: ARS_SPECIAL = 5;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_SPECIAL"] = 5] = "ARS_SPECIAL";
    /**
     *
     *
     * @generated from protobuf enum value: ARS_CANCELBLOCK = 6;
     */
    AttentionRelationStatus[AttentionRelationStatus["ARS_CANCELBLOCK"] = 6] = "ARS_CANCELBLOCK";
})(AttentionRelationStatus || (AttentionRelationStatus = {}));
/**
 * @generated from protobuf enum bilibili.app.viewunite.common.DescType
 */
var DescType;
(function (DescType) {
    /**
     *
     *
     * @generated from protobuf enum value: DescTypeUnknown = 0;
     */
    DescType[DescType["DescTypeUnknown"] = 0] = "DescTypeUnknown";
    /**
     *
     *
     * @generated from protobuf enum value: DescTypeText = 1;
     */
    DescType[DescType["DescTypeText"] = 1] = "DescTypeText";
    /**
     *
     *
     * @generated from protobuf enum value: DescTypeAt = 2;
     */
    DescType[DescType["DescTypeAt"] = 2] = "DescTypeAt";
})(DescType || (DescType = {}));
/**
 * 荣誉 Banner 跳转类型
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.HonorJumpType
 */
var HonorJumpType;
(function (HonorJumpType) {
    /**
     *
     *
     * @generated from protobuf enum value: HONOR_JUMP_TYPE_UNKNOWN = 0;
     */
    HonorJumpType[HonorJumpType["HONOR_JUMP_TYPE_UNKNOWN"] = 0] = "HONOR_JUMP_TYPE_UNKNOWN";
    /**
     *
     *
     * @generated from protobuf enum value: HONOR_OPEN_URL = 1;
     */
    HonorJumpType[HonorJumpType["HONOR_OPEN_URL"] = 1] = "HONOR_OPEN_URL";
    /**
     *
     *
     * @generated from protobuf enum value: HONOR_HALF_SCREEN = 2;
     */
    HonorJumpType[HonorJumpType["HONOR_HALF_SCREEN"] = 2] = "HONOR_HALF_SCREEN";
})(HonorJumpType || (HonorJumpType = {}));
/**
 * 荣誉类型
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.HonorType
 */
var HonorType;
(function (HonorType) {
    /**
     *
     *
     * @generated from protobuf enum value: HONOR_NONE = 0;
     */
    HonorType[HonorType["HONOR_NONE"] = 0] = "HONOR_NONE";
    /**
     *
     *
     * @generated from protobuf enum value: PLAYLET = 1;
     */
    HonorType[HonorType["PLAYLET"] = 1] = "PLAYLET";
    /**
     * 视频存在争议
     *
     * @generated from protobuf enum value: ARGUE = 2;
     */
    HonorType[HonorType["ARGUE"] = 2] = "ARGUE";
    /**
     *
     *
     * @generated from protobuf enum value: NOTICE = 3;
     */
    HonorType[HonorType["NOTICE"] = 3] = "NOTICE";
    /**
     *
     *
     * @generated from protobuf enum value: GUIDANCE = 4;
     */
    HonorType[HonorType["GUIDANCE"] = 4] = "GUIDANCE";
    /**
     * 哔哩哔哩榜
     *
     * @generated from protobuf enum value: HONOR_BILI_RANK = 5;
     */
    HonorType[HonorType["HONOR_BILI_RANK"] = 5] = "HONOR_BILI_RANK";
    /**
     * 周榜
     *
     * @generated from protobuf enum value: HONOR_WEEKLY_RANK = 6;
     */
    HonorType[HonorType["HONOR_WEEKLY_RANK"] = 6] = "HONOR_WEEKLY_RANK";
    /**
     * 日榜
     *
     * @generated from protobuf enum value: HONOR_DAILY_RANK = 7;
     */
    HonorType[HonorType["HONOR_DAILY_RANK"] = 7] = "HONOR_DAILY_RANK";
    /**
     *
     *
     * @generated from protobuf enum value: HONOR_CHANNEL = 8;
     */
    HonorType[HonorType["HONOR_CHANNEL"] = 8] = "HONOR_CHANNEL";
    /**
     * 音乐榜?
     *
     * @generated from protobuf enum value: HONOR_MUSIC = 9;
     */
    HonorType[HonorType["HONOR_MUSIC"] = 9] = "HONOR_MUSIC";
    /**
     *
     *
     * @generated from protobuf enum value: HONOR_REPLY = 10;
     */
    HonorType[HonorType["HONOR_REPLY"] = 10] = "HONOR_REPLY";
})(HonorType || (HonorType = {}));
/**
 *
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.KingPositionType
 */
var KingPositionType;
(function (KingPositionType) {
    /**
     *
     *
     * @generated from protobuf enum value: KING_POS_UNSPECIFIED = 0;
     */
    KingPositionType[KingPositionType["KING_POS_UNSPECIFIED"] = 0] = "KING_POS_UNSPECIFIED";
    /**
     *
     *
     * @generated from protobuf enum value: LIKE = 1;
     */
    KingPositionType[KingPositionType["LIKE"] = 1] = "LIKE";
    /**
     *
     *
     * @generated from protobuf enum value: DISLIKE = 2;
     */
    KingPositionType[KingPositionType["DISLIKE"] = 2] = "DISLIKE";
    /**
     *
     *
     * @generated from protobuf enum value: COIN = 3;
     */
    KingPositionType[KingPositionType["COIN"] = 3] = "COIN";
    /**
     *
     *
     * @generated from protobuf enum value: FAV = 4;
     */
    KingPositionType[KingPositionType["FAV"] = 4] = "FAV";
    /**
     *
     *
     * @generated from protobuf enum value: SHARE = 5;
     */
    KingPositionType[KingPositionType["SHARE"] = 5] = "SHARE";
    /**
     *
     *
     * @generated from protobuf enum value: CACHE = 6;
     */
    KingPositionType[KingPositionType["CACHE"] = 6] = "CACHE";
    /**
     *
     *
     * @generated from protobuf enum value: DANMAKU = 7;
     */
    KingPositionType[KingPositionType["DANMAKU"] = 7] = "DANMAKU";
})(KingPositionType || (KingPositionType = {}));
/**
 * @generated from protobuf enum bilibili.app.viewunite.common.ModuleType
 */
var ModuleType;
(function (ModuleType) {
    /**
     *
     *
     * @generated from protobuf enum value: UNKNOWN = 0;
     */
    ModuleType[ModuleType["UNKNOWN"] = 0] = "UNKNOWN";
    /**
     *
     *
     * @generated from protobuf enum value: OGV_INTRODUCTION = 1;
     */
    ModuleType[ModuleType["OGV_INTRODUCTION"] = 1] = "OGV_INTRODUCTION";
    /**
     *
     *
     * @generated from protobuf enum value: OGV_TITLE = 2;
     */
    ModuleType[ModuleType["OGV_TITLE"] = 2] = "OGV_TITLE";
    /**
     *
     *
     * @generated from protobuf enum value: UGC_HEADLINE = 3;
     */
    ModuleType[ModuleType["UGC_HEADLINE"] = 3] = "UGC_HEADLINE";
    /**
     *
     *
     * @generated from protobuf enum value: UGC_INTRODUCTION = 4;
     */
    ModuleType[ModuleType["UGC_INTRODUCTION"] = 4] = "UGC_INTRODUCTION";
    /**
     *
     *
     * @generated from protobuf enum value: KING_POSITION = 5;
     */
    ModuleType[ModuleType["KING_POSITION"] = 5] = "KING_POSITION";
    /**
     *
     *
     * @generated from protobuf enum value: MASTER_USER_LIST = 6;
     */
    ModuleType[ModuleType["MASTER_USER_LIST"] = 6] = "MASTER_USER_LIST";
    /**
     *
     *
     * @generated from protobuf enum value: STAFFS = 7;
     */
    ModuleType[ModuleType["STAFFS"] = 7] = "STAFFS";
    /**
     *
     *
     * @generated from protobuf enum value: HONOR = 8;
     */
    ModuleType[ModuleType["HONOR"] = 8] = "HONOR";
    /**
     *
     *
     * @generated from protobuf enum value: OWNER = 9;
     */
    ModuleType[ModuleType["OWNER"] = 9] = "OWNER";
    /**
     *
     *
     * @generated from protobuf enum value: PAGE = 10;
     */
    ModuleType[ModuleType["PAGE"] = 10] = "PAGE";
    /**
     *
     *
     * @generated from protobuf enum value: ACTIVITY_RESERVE = 11;
     */
    ModuleType[ModuleType["ACTIVITY_RESERVE"] = 11] = "ACTIVITY_RESERVE";
    /**
     *
     *
     * @generated from protobuf enum value: LIVE_ORDER = 12;
     */
    ModuleType[ModuleType["LIVE_ORDER"] = 12] = "LIVE_ORDER";
    /**
     *
     *
     * @generated from protobuf enum value: POSITIVE = 13;
     */
    ModuleType[ModuleType["POSITIVE"] = 13] = "POSITIVE";
    /**
     *
     *
     * @generated from protobuf enum value: SECTION = 14;
     */
    ModuleType[ModuleType["SECTION"] = 14] = "SECTION";
    /**
     *
     *
     * @generated from protobuf enum value: RELATE = 15;
     */
    ModuleType[ModuleType["RELATE"] = 15] = "RELATE";
    /**
     *
     *
     * @generated from protobuf enum value: PUGV = 16;
     */
    ModuleType[ModuleType["PUGV"] = 16] = "PUGV";
    /**
     *
     *
     * @generated from protobuf enum value: COLLECTION_CARD = 17;
     */
    ModuleType[ModuleType["COLLECTION_CARD"] = 17] = "COLLECTION_CARD";
    /**
     *
     *
     * @generated from protobuf enum value: ACTIVITY = 18;
     */
    ModuleType[ModuleType["ACTIVITY"] = 18] = "ACTIVITY";
    /**
     *
     *
     * @generated from protobuf enum value: CHARACTER = 19;
     */
    ModuleType[ModuleType["CHARACTER"] = 19] = "CHARACTER";
    /**
     *
     *
     * @generated from protobuf enum value: FOLLOW_LAYER = 20;
     */
    ModuleType[ModuleType["FOLLOW_LAYER"] = 20] = "FOLLOW_LAYER";
    /**
     *
     *
     * @generated from protobuf enum value: OGV_SEASONS = 21;
     */
    ModuleType[ModuleType["OGV_SEASONS"] = 21] = "OGV_SEASONS";
    /**
     *
     *
     * @generated from protobuf enum value: UGC_SEASON = 22;
     */
    ModuleType[ModuleType["UGC_SEASON"] = 22] = "UGC_SEASON";
    /**
     *
     *
     * @generated from protobuf enum value: OGV_LIVE_RESERVE = 23;
     */
    ModuleType[ModuleType["OGV_LIVE_RESERVE"] = 23] = "OGV_LIVE_RESERVE";
    /**
     *
     *
     * @generated from protobuf enum value: COMBINATION_EPISODE = 24;
     */
    ModuleType[ModuleType["COMBINATION_EPISODE"] = 24] = "COMBINATION_EPISODE";
    /**
     *
     *
     * @generated from protobuf enum value: SPONSOR = 25;
     */
    ModuleType[ModuleType["SPONSOR"] = 25] = "SPONSOR";
    /**
     *
     *
     * @generated from protobuf enum value: ACTIVITY_ENTRANCE = 26;
     */
    ModuleType[ModuleType["ACTIVITY_ENTRANCE"] = 26] = "ACTIVITY_ENTRANCE";
    /**
     *
     *
     * @generated from protobuf enum value: THEATRE_HOT_TOPIC = 27;
     */
    ModuleType[ModuleType["THEATRE_HOT_TOPIC"] = 27] = "THEATRE_HOT_TOPIC";
    /**
     *
     *
     * @generated from protobuf enum value: RELATED_RECOMMEND = 28;
     */
    ModuleType[ModuleType["RELATED_RECOMMEND"] = 28] = "RELATED_RECOMMEND";
    /**
     *
     *
     * @generated from protobuf enum value: PAY_BAR = 29;
     */
    ModuleType[ModuleType["PAY_BAR"] = 29] = "PAY_BAR";
    /**
     *
     *
     * @generated from protobuf enum value: BANNER = 30;
     */
    ModuleType[ModuleType["BANNER"] = 30] = "BANNER";
    /**
     *
     *
     * @generated from protobuf enum value: AUDIO = 31;
     */
    ModuleType[ModuleType["AUDIO"] = 31] = "AUDIO";
    /**
     *
     *
     * @generated from protobuf enum value: AGG_CARD = 32;
     */
    ModuleType[ModuleType["AGG_CARD"] = 32] = "AGG_CARD";
    /**
     *
     *
     * @generated from protobuf enum value: SINGLE_EP = 33;
     */
    ModuleType[ModuleType["SINGLE_EP"] = 33] = "SINGLE_EP";
    /**
     *
     *
     * @generated from protobuf enum value: LIKE_COMMENT = 34;
     */
    ModuleType[ModuleType["LIKE_COMMENT"] = 34] = "LIKE_COMMENT";
    /**
     *
     *
     * @generated from protobuf enum value: ATTENTION_RECOMMEND = 35;
     */
    ModuleType[ModuleType["ATTENTION_RECOMMEND"] = 35] = "ATTENTION_RECOMMEND";
    /**
     *
     *
     * @generated from protobuf enum value: COVENANTER = 36;
     */
    ModuleType[ModuleType["COVENANTER"] = 36] = "COVENANTER";
})(ModuleType || (ModuleType = {}));
/**
 *
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.OccupationType
 */
var OccupationType;
(function (OccupationType) {
    /**
     *
     *
     * @generated from protobuf enum value: STAFF = 0;
     */
    OccupationType[OccupationType["STAFF"] = 0] = "STAFF";
    /**
     *
     *
     * @generated from protobuf enum value: CAST = 1;
     */
    OccupationType[OccupationType["CAST"] = 1] = "CAST";
})(OccupationType || (OccupationType = {}));
/**
 * 视频详情下方推荐卡子类型
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.RelateCardType
 */
var RelateCardType;
(function (RelateCardType) {
    /**
     *
     *
     * @generated from protobuf enum value: CARD_TYPE_UNKNOWN = 0;
     */
    RelateCardType[RelateCardType["CARD_TYPE_UNKNOWN"] = 0] = "CARD_TYPE_UNKNOWN";
    /**
     *
     *
     * @generated from protobuf enum value: AV = 1;
     */
    RelateCardType[RelateCardType["AV"] = 1] = "AV";
    /**
     *
     *
     * @generated from protobuf enum value: BANGUMI = 2;
     */
    RelateCardType[RelateCardType["BANGUMI"] = 2] = "BANGUMI";
    /**
     *
     *
     * @generated from protobuf enum value: RESOURCE = 3;
     */
    RelateCardType[RelateCardType["RESOURCE"] = 3] = "RESOURCE";
    /**
     *
     *
     * @generated from protobuf enum value: GAME = 4;
     */
    RelateCardType[RelateCardType["GAME"] = 4] = "GAME";
    /**
     *
     *
     * @generated from protobuf enum value: CM = 5;
     */
    RelateCardType[RelateCardType["CM"] = 5] = "CM";
    /**
     *
     *
     * @generated from protobuf enum value: LIVE = 6;
     */
    RelateCardType[RelateCardType["LIVE"] = 6] = "LIVE";
    /**
     *
     *
     * @generated from protobuf enum value: AI_RECOMMEND = 7;
     */
    RelateCardType[RelateCardType["AI_RECOMMEND"] = 7] = "AI_RECOMMEND";
    /**
     *
     *
     * @generated from protobuf enum value: BANGUMI_AV = 8;
     */
    RelateCardType[RelateCardType["BANGUMI_AV"] = 8] = "BANGUMI_AV";
    /**
     *
     *
     * @generated from protobuf enum value: BANGUMI_UGC = 9;
     */
    RelateCardType[RelateCardType["BANGUMI_UGC"] = 9] = "BANGUMI_UGC";
    /**
     *
     *
     * @generated from protobuf enum value: SPECIAL = 10;
     */
    RelateCardType[RelateCardType["SPECIAL"] = 10] = "SPECIAL";
})(RelateCardType || (RelateCardType = {}));
/**
 *
 *
 * @generated from protobuf enum bilibili.app.viewunite.common.ReserveBizType
 */
var ReserveBizType;
(function (ReserveBizType) {
    /**
     *
     *
     * @generated from protobuf enum value: BizTypeNone = 0;
     */
    ReserveBizType[ReserveBizType["BizTypeNone"] = 0] = "BizTypeNone";
    /**
     *
     *
     * @generated from protobuf enum value: BizTypeReserveActivity = 1;
     */
    ReserveBizType[ReserveBizType["BizTypeReserveActivity"] = 1] = "BizTypeReserveActivity";
    /**
     *
     *
     * @generated from protobuf enum value: BizTypeFavSeason = 2;
     */
    ReserveBizType[ReserveBizType["BizTypeFavSeason"] = 2] = "BizTypeFavSeason";
})(ReserveBizType || (ReserveBizType = {}));
/**
 * @generated from protobuf enum bilibili.app.viewunite.common.SeasonType
 */
var SeasonType;
(function (SeasonType) {
    /**
     *
     *
     * @generated from protobuf enum value: Unknown = 0;
     */
    SeasonType[SeasonType["Unknown"] = 0] = "Unknown";
    /**
     *
     *
     * @generated from protobuf enum value: Base = 1;
     */
    SeasonType[SeasonType["Base"] = 1] = "Base";
    /**
     *
     *
     * @generated from protobuf enum value: Good = 2;
     */
    SeasonType[SeasonType["Good"] = 2] = "Good";
})(SeasonType || (SeasonType = {}));
/**
 * @generated from protobuf enum bilibili.app.viewunite.common.SerialSeasonCoverStyle
 */
var SerialSeasonCoverStyle;
(function (SerialSeasonCoverStyle) {
    /**
     *
     *
     * @generated from protobuf enum value: TITLE = 0;
     */
    SerialSeasonCoverStyle[SerialSeasonCoverStyle["TITLE"] = 0] = "TITLE";
    /**
     *
     *
     * @generated from protobuf enum value: PICTURE = 1;
     */
    SerialSeasonCoverStyle[SerialSeasonCoverStyle["PICTURE"] = 1] = "PICTURE";
})(SerialSeasonCoverStyle || (SerialSeasonCoverStyle = {}));
// @generated message type with reflection information, may provide speed optimized methods
class Activity$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Activity", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "ab", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "show_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "picurl", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "picurl_selected", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "h5_link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "jump_mode", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "items", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Item }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.title = "";
        message.link = "";
        message.cover = "";
        message.type = 0;
        message.ab = "";
        message.showName = "";
        message.picurl = "";
        message.picurlSelected = "";
        message.h5Link = "";
        message.jumpMode = "";
        message.items = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* string link */ 3:
                    message.link = reader.string();
                    break;
                case /* string cover */ 4:
                    message.cover = reader.string();
                    break;
                case /* int32 type */ 5:
                    message.type = reader.int32();
                    break;
                case /* string ab */ 6:
                    message.ab = reader.string();
                    break;
                case /* string show_name */ 7:
                    message.showName = reader.string();
                    break;
                case /* string picurl */ 8:
                    message.picurl = reader.string();
                    break;
                case /* string picurl_selected */ 9:
                    message.picurlSelected = reader.string();
                    break;
                case /* string h5_link */ 10:
                    message.h5Link = reader.string();
                    break;
                case /* string jump_mode */ 11:
                    message.jumpMode = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.Item items */ 12:
                    message.items.push(Item.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* string link = 3; */
        if (message.link !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.link);
        /* string cover = 4; */
        if (message.cover !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.cover);
        /* int32 type = 5; */
        if (message.type !== 0)
            writer.tag(5, WireType.Varint).int32(message.type);
        /* string ab = 6; */
        if (message.ab !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.ab);
        /* string show_name = 7; */
        if (message.showName !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.showName);
        /* string picurl = 8; */
        if (message.picurl !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.picurl);
        /* string picurl_selected = 9; */
        if (message.picurlSelected !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.picurlSelected);
        /* string h5_link = 10; */
        if (message.h5Link !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.h5Link);
        /* string jump_mode = 11; */
        if (message.jumpMode !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.jumpMode);
        /* repeated bilibili.app.viewunite.common.Item items = 12; */
        for (let i = 0; i < message.items.length; i++)
            Item.internalBinaryWrite(message.items[i], writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Activity
 */
const Activity = new Activity$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ActivityEntrance$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ActivityEntrance", [
            { no: 1, name: "activity_cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "activity_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "word_tag", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "activity_subtitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "activity_link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "activity_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "reserve_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "status", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 9, name: "upper_list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => User },
            { no: 10, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.activityCover = "";
        message.activityTitle = "";
        message.wordTag = "";
        message.activitySubtitle = "";
        message.activityLink = "";
        message.activityType = 0;
        message.reserveId = 0;
        message.status = 0;
        message.upperList = [];
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string activity_cover */ 1:
                    message.activityCover = reader.string();
                    break;
                case /* string activity_title */ 2:
                    message.activityTitle = reader.string();
                    break;
                case /* string word_tag */ 3:
                    message.wordTag = reader.string();
                    break;
                case /* string activity_subtitle */ 4:
                    message.activitySubtitle = reader.string();
                    break;
                case /* string activity_link */ 5:
                    message.activityLink = reader.string();
                    break;
                case /* int32 activity_type */ 6:
                    message.activityType = reader.int32();
                    break;
                case /* int32 reserve_id */ 7:
                    message.reserveId = reader.int32();
                    break;
                case /* int32 status */ 8:
                    message.status = reader.int32();
                    break;
                case /* repeated bilibili.app.viewunite.common.User upper_list */ 9:
                    message.upperList.push(User.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* map<string, string> report */ 10:
                    this.binaryReadMap10(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap10(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.ActivityEntrance.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* string activity_cover = 1; */
        if (message.activityCover !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.activityCover);
        /* string activity_title = 2; */
        if (message.activityTitle !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.activityTitle);
        /* string word_tag = 3; */
        if (message.wordTag !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.wordTag);
        /* string activity_subtitle = 4; */
        if (message.activitySubtitle !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.activitySubtitle);
        /* string activity_link = 5; */
        if (message.activityLink !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.activityLink);
        /* int32 activity_type = 6; */
        if (message.activityType !== 0)
            writer.tag(6, WireType.Varint).int32(message.activityType);
        /* int32 reserve_id = 7; */
        if (message.reserveId !== 0)
            writer.tag(7, WireType.Varint).int32(message.reserveId);
        /* int32 status = 8; */
        if (message.status !== 0)
            writer.tag(8, WireType.Varint).int32(message.status);
        /* repeated bilibili.app.viewunite.common.User upper_list = 9; */
        for (let i = 0; i < message.upperList.length; i++)
            User.internalBinaryWrite(message.upperList[i], writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* map<string, string> report = 10; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(10, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ActivityEntrance
 */
const ActivityEntrance = new ActivityEntrance$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ActivityEntranceModule$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ActivityEntranceModule", [
            { no: 1, name: "activity_entrance", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ActivityEntrance }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.activityEntrance = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.ActivityEntrance activity_entrance */ 1:
                    message.activityEntrance.push(ActivityEntrance.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.ActivityEntrance activity_entrance = 1; */
        for (let i = 0; i < message.activityEntrance.length; i++)
            ActivityEntrance.internalBinaryWrite(message.activityEntrance[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ActivityEntranceModule
 */
const ActivityEntranceModule = new ActivityEntranceModule$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ActivityReserve$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ActivityReserve", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "vt", kind: "message", T: () => StatInfo },
            { no: 3, name: "danmaku", kind: "message", T: () => StatInfo },
            { no: 4, name: "button", kind: "message", T: () => ReserveButton }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.StatInfo vt */ 2:
                    message.vt = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.vt);
                    break;
                case /* bilibili.app.viewunite.common.StatInfo danmaku */ 3:
                    message.danmaku = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.danmaku);
                    break;
                case /* bilibili.app.viewunite.common.ReserveButton button */ 4:
                    message.button = ReserveButton.internalBinaryRead(reader, reader.uint32(), options, message.button);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* bilibili.app.viewunite.common.StatInfo vt = 2; */
        if (message.vt)
            StatInfo.internalBinaryWrite(message.vt, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.StatInfo danmaku = 3; */
        if (message.danmaku)
            StatInfo.internalBinaryWrite(message.danmaku, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.ReserveButton button = 4; */
        if (message.button)
            ReserveButton.internalBinaryWrite(message.button, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ActivityReserve
 */
const ActivityReserve = new ActivityReserve$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ActivityResource$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ActivityResource", [
            { no: 1, name: "mod_pool_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "mod_resource_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.modPoolName = "";
        message.modResourceName = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string mod_pool_name */ 1:
                    message.modPoolName = reader.string();
                    break;
                case /* string mod_resource_name */ 2:
                    message.modResourceName = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string mod_pool_name = 1; */
        if (message.modPoolName !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.modPoolName);
        /* string mod_resource_name = 2; */
        if (message.modResourceName !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.modResourceName);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ActivityResource
 */
const ActivityResource = new ActivityResource$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ActivityTab$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ActivityTab", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "show_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "picurl", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "picurl_selected", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "h5_link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "link_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 10, name: "biz_key", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 11, name: "desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "act_ext", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 13, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.title = "";
        message.type = 0;
        message.showName = "";
        message.picurl = "";
        message.picurlSelected = "";
        message.h5Link = "";
        message.link = "";
        message.linkType = 0;
        message.bizKey = 0;
        message.desc = "";
        message.actExt = "";
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* int32 type */ 3:
                    message.type = reader.int32();
                    break;
                case /* string show_name */ 4:
                    message.showName = reader.string();
                    break;
                case /* string picurl */ 5:
                    message.picurl = reader.string();
                    break;
                case /* string picurl_selected */ 6:
                    message.picurlSelected = reader.string();
                    break;
                case /* string h5_link */ 7:
                    message.h5Link = reader.string();
                    break;
                case /* string link */ 8:
                    message.link = reader.string();
                    break;
                case /* int32 link_type */ 9:
                    message.linkType = reader.int32();
                    break;
                case /* int64 biz_key */ 10:
                    message.bizKey = reader.int64().toNumber();
                    break;
                case /* string desc */ 11:
                    message.desc = reader.string();
                    break;
                case /* string act_ext */ 12:
                    message.actExt = reader.string();
                    break;
                case /* map<string, string> report */ 13:
                    this.binaryReadMap13(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap13(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.ActivityTab.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* int32 type = 3; */
        if (message.type !== 0)
            writer.tag(3, WireType.Varint).int32(message.type);
        /* string show_name = 4; */
        if (message.showName !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.showName);
        /* string picurl = 5; */
        if (message.picurl !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.picurl);
        /* string picurl_selected = 6; */
        if (message.picurlSelected !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.picurlSelected);
        /* string h5_link = 7; */
        if (message.h5Link !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.h5Link);
        /* string link = 8; */
        if (message.link !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.link);
        /* int32 link_type = 9; */
        if (message.linkType !== 0)
            writer.tag(9, WireType.Varint).int32(message.linkType);
        /* int64 biz_key = 10; */
        if (message.bizKey !== 0)
            writer.tag(10, WireType.Varint).int64(message.bizKey);
        /* string desc = 11; */
        if (message.desc !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.desc);
        /* string act_ext = 12; */
        if (message.actExt !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.actExt);
        /* map<string, string> report = 13; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(13, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ActivityTab
 */
new ActivityTab$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AggEpCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.AggEpCard", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "num", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "jump_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.cover = "";
        message.icon = "";
        message.num = 0;
        message.jumpUrl = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* string cover */ 2:
                    message.cover = reader.string();
                    break;
                case /* string icon */ 3:
                    message.icon = reader.string();
                    break;
                case /* int32 num */ 4:
                    message.num = reader.int32();
                    break;
                case /* string jump_url */ 5:
                    message.jumpUrl = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* string cover = 2; */
        if (message.cover !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.cover);
        /* string icon = 3; */
        if (message.icon !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.icon);
        /* int32 num = 4; */
        if (message.num !== 0)
            writer.tag(4, WireType.Varint).int32(message.num);
        /* string jump_url = 5; */
        if (message.jumpUrl !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.jumpUrl);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.AggEpCard
 */
const AggEpCard = new AggEpCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AggEps$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.AggEps", [
            { no: 1, name: "agg_ep_cards", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => AggEpCard },
            { no: 2, name: "place_index", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.aggEpCards = [];
        message.placeIndex = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.AggEpCard agg_ep_cards */ 1:
                    message.aggEpCards.push(AggEpCard.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* int32 place_index */ 2:
                    message.placeIndex = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.AggEpCard agg_ep_cards = 1; */
        for (let i = 0; i < message.aggEpCards.length; i++)
            AggEpCard.internalBinaryWrite(message.aggEpCards[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* int32 place_index = 2; */
        if (message.placeIndex !== 0)
            writer.tag(2, WireType.Varint).int32(message.placeIndex);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.AggEps
 */
const AggEps = new AggEps$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AttentionRecommend$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.AttentionRecommend", []);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        return target ?? this.create();
    }
    internalBinaryWrite(message, writer, options) {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.AttentionRecommend
 */
const AttentionRecommend = new AttentionRecommend$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Audio$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Audio", [
            { no: 1, name: "audio_info", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "message", T: () => AudioInfo } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.audioInfo = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* map<int64, bilibili.app.viewunite.common.AudioInfo> audio_info */ 1:
                    this.binaryReadMap1(message.audioInfo, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap1(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int64().toString();
                    break;
                case 2:
                    val = AudioInfo.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.Audio.audio_info");
            }
        }
        map[key ?? "0"] = val ?? AudioInfo.create();
    }
    internalBinaryWrite(message, writer, options) {
        /* map<int64, bilibili.app.viewunite.common.AudioInfo> audio_info = 1; */
        for (let k of globalThis.Object.keys(message.audioInfo)) {
            writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int64(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            AudioInfo.internalBinaryWrite(message.audioInfo[k], writer, options);
            writer.join().join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Audio
 */
const Audio = new Audio$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AudioInfo$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.AudioInfo", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "cover_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "song_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "play_count", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 5, name: "reply_count", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 6, name: "upper_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 7, name: "entrance", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "song_attr", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.coverUrl = "";
        message.songId = 0;
        message.playCount = 0;
        message.replyCount = 0;
        message.upperId = 0;
        message.entrance = "";
        message.songAttr = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* string cover_url */ 2:
                    message.coverUrl = reader.string();
                    break;
                case /* int64 song_id = 3 [jstype = JS_NUMBER];*/ 3:
                    message.songId = reader.int64().toNumber();
                    break;
                case /* int64 play_count = 4 [jstype = JS_NUMBER];*/ 4:
                    message.playCount = reader.int64().toNumber();
                    break;
                case /* int64 reply_count = 5 [jstype = JS_NUMBER];*/ 5:
                    message.replyCount = reader.int64().toNumber();
                    break;
                case /* int64 upper_id = 6 [jstype = JS_NUMBER];*/ 6:
                    message.upperId = reader.int64().toNumber();
                    break;
                case /* string entrance */ 7:
                    message.entrance = reader.string();
                    break;
                case /* int64 song_attr = 8 [jstype = JS_NUMBER];*/ 8:
                    message.songAttr = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* string cover_url = 2; */
        if (message.coverUrl !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.coverUrl);
        /* int64 song_id = 3 [jstype = JS_NUMBER]; */
        if (message.songId !== 0)
            writer.tag(3, WireType.Varint).int64(message.songId);
        /* int64 play_count = 4 [jstype = JS_NUMBER]; */
        if (message.playCount !== 0)
            writer.tag(4, WireType.Varint).int64(message.playCount);
        /* int64 reply_count = 5 [jstype = JS_NUMBER]; */
        if (message.replyCount !== 0)
            writer.tag(5, WireType.Varint).int64(message.replyCount);
        /* int64 upper_id = 6 [jstype = JS_NUMBER]; */
        if (message.upperId !== 0)
            writer.tag(6, WireType.Varint).int64(message.upperId);
        /* string entrance = 7; */
        if (message.entrance !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.entrance);
        /* int64 song_attr = 8 [jstype = JS_NUMBER]; */
        if (message.songAttr !== 0)
            writer.tag(8, WireType.Varint).int64(message.songAttr);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.AudioInfo
 */
const AudioInfo = new AudioInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BadgeInfo$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.BadgeInfo", [
            { no: 1, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "text_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "text_color_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "bg_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "bg_color_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "border_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "border_color_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "bg_style", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 9, name: "img", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.text = "";
        message.textColor = "";
        message.textColorNight = "";
        message.bgColor = "";
        message.bgColorNight = "";
        message.borderColor = "";
        message.borderColorNight = "";
        message.bgStyle = 0;
        message.img = "";
        message.type = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string text */ 1:
                    message.text = reader.string();
                    break;
                case /* string text_color */ 2:
                    message.textColor = reader.string();
                    break;
                case /* string text_color_night */ 3:
                    message.textColorNight = reader.string();
                    break;
                case /* string bg_color */ 4:
                    message.bgColor = reader.string();
                    break;
                case /* string bg_color_night */ 5:
                    message.bgColorNight = reader.string();
                    break;
                case /* string border_color */ 6:
                    message.borderColor = reader.string();
                    break;
                case /* string border_color_night */ 7:
                    message.borderColorNight = reader.string();
                    break;
                case /* int32 bg_style */ 8:
                    message.bgStyle = reader.int32();
                    break;
                case /* string img */ 9:
                    message.img = reader.string();
                    break;
                case /* int32 type */ 10:
                    message.type = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string text = 1; */
        if (message.text !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.text);
        /* string text_color = 2; */
        if (message.textColor !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.textColor);
        /* string text_color_night = 3; */
        if (message.textColorNight !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.textColorNight);
        /* string bg_color = 4; */
        if (message.bgColor !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.bgColor);
        /* string bg_color_night = 5; */
        if (message.bgColorNight !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.bgColorNight);
        /* string border_color = 6; */
        if (message.borderColor !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.borderColor);
        /* string border_color_night = 7; */
        if (message.borderColorNight !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.borderColorNight);
        /* int32 bg_style = 8; */
        if (message.bgStyle !== 0)
            writer.tag(8, WireType.Varint).int32(message.bgStyle);
        /* string img = 9; */
        if (message.img !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.img);
        /* int32 type = 10; */
        if (message.type !== 0)
            writer.tag(10, WireType.Varint).int32(message.type);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.BadgeInfo
 */
const BadgeInfo = new BadgeInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Banner$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Banner", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "relate_item", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => RelateItem }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.relateItem = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.RelateItem relate_item */ 2:
                    message.relateItem.push(RelateItem.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* repeated bilibili.app.viewunite.common.RelateItem relate_item = 2; */
        for (let i = 0; i < message.relateItem.length; i++)
            RelateItem.internalBinaryWrite(message.relateItem[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Banner
 */
const Banner = new Banner$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BizFavParam$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.BizFavParam", [
            { no: 1, name: "season_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.seasonId = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 season_id = 1 [jstype = JS_NUMBER];*/ 1:
                    message.seasonId = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 season_id = 1 [jstype = JS_NUMBER]; */
        if (message.seasonId !== 0)
            writer.tag(1, WireType.Varint).int64(message.seasonId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.BizFavParam
 */
const BizFavParam = new BizFavParam$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BizReserveActivityParam$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.BizReserveActivityParam", [
            { no: 1, name: "activity_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "from", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "oid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 5, name: "reserve_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.activityId = 0;
        message.from = "";
        message.type = "";
        message.oid = 0;
        message.reserveId = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 activity_id = 1 [jstype = JS_NUMBER];*/ 1:
                    message.activityId = reader.int64().toNumber();
                    break;
                case /* string from */ 2:
                    message.from = reader.string();
                    break;
                case /* string type */ 3:
                    message.type = reader.string();
                    break;
                case /* int64 oid = 4 [jstype = JS_NUMBER];*/ 4:
                    message.oid = reader.int64().toNumber();
                    break;
                case /* int64 reserve_id = 5 [jstype = JS_NUMBER];*/ 5:
                    message.reserveId = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 activity_id = 1 [jstype = JS_NUMBER]; */
        if (message.activityId !== 0)
            writer.tag(1, WireType.Varint).int64(message.activityId);
        /* string from = 2; */
        if (message.from !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.from);
        /* string type = 3; */
        if (message.type !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.type);
        /* int64 oid = 4 [jstype = JS_NUMBER]; */
        if (message.oid !== 0)
            writer.tag(4, WireType.Varint).int64(message.oid);
        /* int64 reserve_id = 5 [jstype = JS_NUMBER]; */
        if (message.reserveId !== 0)
            writer.tag(5, WireType.Varint).int64(message.reserveId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.BizReserveActivityParam
 */
const BizReserveActivityParam = new BizReserveActivityParam$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Button$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Button", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "left_strikethrough_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "badge_info", kind: "message", T: () => BadgeInfo },
            { no: 6, name: "sub_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.leftStrikethroughText = "";
        message.type = "";
        message.link = "";
        message.subTitle = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* string left_strikethrough_text */ 2:
                    message.leftStrikethroughText = reader.string();
                    break;
                case /* string type */ 3:
                    message.type = reader.string();
                    break;
                case /* string link */ 4:
                    message.link = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo badge_info */ 5:
                    message.badgeInfo = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badgeInfo);
                    break;
                case /* string sub_title */ 6:
                    message.subTitle = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* string left_strikethrough_text = 2; */
        if (message.leftStrikethroughText !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.leftStrikethroughText);
        /* string type = 3; */
        if (message.type !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.type);
        /* string link = 4; */
        if (message.link !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.link);
        /* bilibili.app.viewunite.common.BadgeInfo badge_info = 5; */
        if (message.badgeInfo)
            BadgeInfo.internalBinaryWrite(message.badgeInfo, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* string sub_title = 6; */
        if (message.subTitle !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.subTitle);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Button
 */
const Button = new Button$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CardBasicInfo$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.CardBasicInfo", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "uri", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "track_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "unique_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "from_source_type", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 8, name: "from_source_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "material_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 10, name: "cover_gif", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "author", kind: "message", T: () => Owner },
            { no: 12, name: "id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 13, name: "from", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 14, name: "from_spmid_suffix", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "report_flow_data", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.desc = "";
        message.cover = "";
        message.uri = "";
        message.trackId = "";
        message.uniqueId = "";
        message.fromSourceType = 0;
        message.fromSourceId = "";
        message.materialId = 0;
        message.coverGif = "";
        message.id = 0;
        message.from = "";
        message.fromSpmidSuffix = "";
        message.reportFlowData = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* string desc */ 2:
                    message.desc = reader.string();
                    break;
                case /* string cover */ 3:
                    message.cover = reader.string();
                    break;
                case /* string uri */ 4:
                    message.uri = reader.string();
                    break;
                case /* string track_id */ 5:
                    message.trackId = reader.string();
                    break;
                case /* string unique_id */ 6:
                    message.uniqueId = reader.string();
                    break;
                case /* int64 from_source_type = 7 [jstype = JS_NUMBER];*/ 7:
                    message.fromSourceType = reader.int64().toNumber();
                    break;
                case /* string from_source_id */ 8:
                    message.fromSourceId = reader.string();
                    break;
                case /* int64 material_id = 9 [jstype = JS_NUMBER];*/ 9:
                    message.materialId = reader.int64().toNumber();
                    break;
                case /* string cover_gif */ 10:
                    message.coverGif = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Owner author */ 11:
                    message.author = Owner.internalBinaryRead(reader, reader.uint32(), options, message.author);
                    break;
                case /* int64 id = 12 [jstype = JS_NUMBER];*/ 12:
                    message.id = reader.int64().toNumber();
                    break;
                case /* string from */ 13:
                    message.from = reader.string();
                    break;
                case /* string from_spmid_suffix */ 14:
                    message.fromSpmidSuffix = reader.string();
                    break;
                case /* string report_flow_data */ 15:
                    message.reportFlowData = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* string desc = 2; */
        if (message.desc !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.desc);
        /* string cover = 3; */
        if (message.cover !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.cover);
        /* string uri = 4; */
        if (message.uri !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.uri);
        /* string track_id = 5; */
        if (message.trackId !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.trackId);
        /* string unique_id = 6; */
        if (message.uniqueId !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.uniqueId);
        /* int64 from_source_type = 7 [jstype = JS_NUMBER]; */
        if (message.fromSourceType !== 0)
            writer.tag(7, WireType.Varint).int64(message.fromSourceType);
        /* string from_source_id = 8; */
        if (message.fromSourceId !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.fromSourceId);
        /* int64 material_id = 9 [jstype = JS_NUMBER]; */
        if (message.materialId !== 0)
            writer.tag(9, WireType.Varint).int64(message.materialId);
        /* string cover_gif = 10; */
        if (message.coverGif !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.coverGif);
        /* bilibili.app.viewunite.common.Owner author = 11; */
        if (message.author)
            Owner.internalBinaryWrite(message.author, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* int64 id = 12 [jstype = JS_NUMBER]; */
        if (message.id !== 0)
            writer.tag(12, WireType.Varint).int64(message.id);
        /* string from = 13; */
        if (message.from !== "")
            writer.tag(13, WireType.LengthDelimited).string(message.from);
        /* string from_spmid_suffix = 14; */
        if (message.fromSpmidSuffix !== "")
            writer.tag(14, WireType.LengthDelimited).string(message.fromSpmidSuffix);
        /* string report_flow_data = 15; */
        if (message.reportFlowData !== "")
            writer.tag(15, WireType.LengthDelimited).string(message.reportFlowData);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.CardBasicInfo
 */
const CardBasicInfo = new CardBasicInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CardStyle$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.CardStyle", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.CardStyle
 */
new CardStyle$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Celebrity$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Celebrity", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "role", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "avatar", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "short_desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "character_avatar", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 10, name: "is_follow", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 11, name: "occupation_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "occupation_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 13, name: "relate_attr", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 14, name: "small_avatar", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.name = "";
        message.role = "";
        message.avatar = "";
        message.shortDesc = "";
        message.desc = "";
        message.characterAvatar = "";
        message.link = "";
        message.mid = 0;
        message.isFollow = 0;
        message.occupationName = "";
        message.occupationType = 0;
        message.relateAttr = 0;
        message.smallAvatar = "";
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string role */ 3:
                    message.role = reader.string();
                    break;
                case /* string avatar */ 4:
                    message.avatar = reader.string();
                    break;
                case /* string short_desc */ 5:
                    message.shortDesc = reader.string();
                    break;
                case /* string desc */ 6:
                    message.desc = reader.string();
                    break;
                case /* string character_avatar */ 7:
                    message.characterAvatar = reader.string();
                    break;
                case /* string link */ 8:
                    message.link = reader.string();
                    break;
                case /* int64 mid = 9 [jstype = JS_NUMBER];*/ 9:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* int32 is_follow */ 10:
                    message.isFollow = reader.int32();
                    break;
                case /* string occupation_name */ 11:
                    message.occupationName = reader.string();
                    break;
                case /* int32 occupation_type */ 12:
                    message.occupationType = reader.int32();
                    break;
                case /* int32 relate_attr */ 13:
                    message.relateAttr = reader.int32();
                    break;
                case /* string small_avatar */ 14:
                    message.smallAvatar = reader.string();
                    break;
                case /* map<string, string> report */ 15:
                    this.binaryReadMap15(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap15(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.Celebrity.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string role = 3; */
        if (message.role !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.role);
        /* string avatar = 4; */
        if (message.avatar !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.avatar);
        /* string short_desc = 5; */
        if (message.shortDesc !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.shortDesc);
        /* string desc = 6; */
        if (message.desc !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.desc);
        /* string character_avatar = 7; */
        if (message.characterAvatar !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.characterAvatar);
        /* string link = 8; */
        if (message.link !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.link);
        /* int64 mid = 9 [jstype = JS_NUMBER]; */
        if (message.mid !== 0)
            writer.tag(9, WireType.Varint).int64(message.mid);
        /* int32 is_follow = 10; */
        if (message.isFollow !== 0)
            writer.tag(10, WireType.Varint).int32(message.isFollow);
        /* string occupation_name = 11; */
        if (message.occupationName !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.occupationName);
        /* int32 occupation_type = 12; */
        if (message.occupationType !== 0)
            writer.tag(12, WireType.Varint).int32(message.occupationType);
        /* int32 relate_attr = 13; */
        if (message.relateAttr !== 0)
            writer.tag(13, WireType.Varint).int32(message.relateAttr);
        /* string small_avatar = 14; */
        if (message.smallAvatar !== "")
            writer.tag(14, WireType.LengthDelimited).string(message.smallAvatar);
        /* map<string, string> report = 15; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(15, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Celebrity
 */
const Celebrity = new Celebrity$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CharacterGroup$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.CharacterGroup", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "characters", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Celebrity }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.characters = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.Celebrity characters */ 2:
                    message.characters.push(Celebrity.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* repeated bilibili.app.viewunite.common.Celebrity characters = 2; */
        for (let i = 0; i < message.characters.length; i++)
            Celebrity.internalBinaryWrite(message.characters[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.CharacterGroup
 */
const CharacterGroup = new CharacterGroup$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Characters$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Characters", [
            { no: 1, name: "groups", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => CharacterGroup }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.groups = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.CharacterGroup groups */ 1:
                    message.groups.push(CharacterGroup.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.CharacterGroup groups = 1; */
        for (let i = 0; i < message.groups.length; i++)
            CharacterGroup.internalBinaryWrite(message.groups[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Characters
 */
const Characters = new Characters$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CoinExtend$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.CoinExtend", [
            { no: 1, name: "coin_app_zip_icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "coin_app_icon_1", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "coin_app_icon_2", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "coin_app_icon_3", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "coin_app_icon_4", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.coinAppZipIcon = "";
        message.coinAppIcon1 = "";
        message.coinAppIcon2 = "";
        message.coinAppIcon3 = "";
        message.coinAppIcon4 = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string coin_app_zip_icon */ 1:
                    message.coinAppZipIcon = reader.string();
                    break;
                case /* string coin_app_icon_1 */ 2:
                    message.coinAppIcon1 = reader.string();
                    break;
                case /* string coin_app_icon_2 */ 3:
                    message.coinAppIcon2 = reader.string();
                    break;
                case /* string coin_app_icon_3 */ 4:
                    message.coinAppIcon3 = reader.string();
                    break;
                case /* string coin_app_icon_4 */ 5:
                    message.coinAppIcon4 = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string coin_app_zip_icon = 1; */
        if (message.coinAppZipIcon !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.coinAppZipIcon);
        /* string coin_app_icon_1 = 2; */
        if (message.coinAppIcon1 !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.coinAppIcon1);
        /* string coin_app_icon_2 = 3; */
        if (message.coinAppIcon2 !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.coinAppIcon2);
        /* string coin_app_icon_3 = 4; */
        if (message.coinAppIcon3 !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.coinAppIcon3);
        /* string coin_app_icon_4 = 5; */
        if (message.coinAppIcon4 !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.coinAppIcon4);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.CoinExtend
 */
const CoinExtend = new CoinExtend$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CombinationEp$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.CombinationEp", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "section_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "can_ord_desc", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "more", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "episode_ids", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "episodes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ViewEpisode },
            { no: 8, name: "split_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "module_style", kind: "message", T: () => Style },
            { no: 10, name: "serial_season", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SerialSeason },
            { no: 11, name: "section_data", kind: "message", T: () => SectionData }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.sectionId = 0;
        message.title = "";
        message.canOrdDesc = 0;
        message.more = "";
        message.episodeIds = [];
        message.episodes = [];
        message.splitText = "";
        message.serialSeason = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* int32 section_id */ 2:
                    message.sectionId = reader.int32();
                    break;
                case /* string title */ 3:
                    message.title = reader.string();
                    break;
                case /* int32 can_ord_desc */ 4:
                    message.canOrdDesc = reader.int32();
                    break;
                case /* string more */ 5:
                    message.more = reader.string();
                    break;
                case /* repeated int32 episode_ids */ 6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.episodeIds.push(reader.int32());
                    else
                        message.episodeIds.push(reader.int32());
                    break;
                case /* repeated bilibili.app.viewunite.common.ViewEpisode episodes */ 7:
                    message.episodes.push(ViewEpisode.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string split_text */ 8:
                    message.splitText = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Style module_style */ 9:
                    message.moduleStyle = Style.internalBinaryRead(reader, reader.uint32(), options, message.moduleStyle);
                    break;
                case /* repeated bilibili.app.viewunite.common.SerialSeason serial_season */ 10:
                    message.serialSeason.push(SerialSeason.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.SectionData section_data */ 11:
                    message.sectionData = SectionData.internalBinaryRead(reader, reader.uint32(), options, message.sectionData);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* int32 section_id = 2; */
        if (message.sectionId !== 0)
            writer.tag(2, WireType.Varint).int32(message.sectionId);
        /* string title = 3; */
        if (message.title !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.title);
        /* int32 can_ord_desc = 4; */
        if (message.canOrdDesc !== 0)
            writer.tag(4, WireType.Varint).int32(message.canOrdDesc);
        /* string more = 5; */
        if (message.more !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.more);
        /* repeated int32 episode_ids = 6; */
        if (message.episodeIds.length) {
            writer.tag(6, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.episodeIds.length; i++)
                writer.int32(message.episodeIds[i]);
            writer.join();
        }
        /* repeated bilibili.app.viewunite.common.ViewEpisode episodes = 7; */
        for (let i = 0; i < message.episodes.length; i++)
            ViewEpisode.internalBinaryWrite(message.episodes[i], writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* string split_text = 8; */
        if (message.splitText !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.splitText);
        /* bilibili.app.viewunite.common.Style module_style = 9; */
        if (message.moduleStyle)
            Style.internalBinaryWrite(message.moduleStyle, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.SerialSeason serial_season = 10; */
        for (let i = 0; i < message.serialSeason.length; i++)
            SerialSeason.internalBinaryWrite(message.serialSeason[i], writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.SectionData section_data = 11; */
        if (message.sectionData)
            SectionData.internalBinaryWrite(message.sectionData, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.CombinationEp
 */
const CombinationEp = new CombinationEp$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Covenanter$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Covenanter", []);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        return target ?? this.create();
    }
    internalBinaryWrite(message, writer, options) {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Covenanter
 */
const Covenanter = new Covenanter$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeliveryData$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.DeliveryData", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "module_style", kind: "message", T: () => Style },
            { no: 3, name: "more", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "activity", kind: "message", oneof: "data", T: () => Activity },
            { no: 5, name: "characters", kind: "message", oneof: "data", T: () => Characters },
            { no: 6, name: "theatre_hot_topic", kind: "message", oneof: "data", T: () => TheatreHotTopic },
            { no: 7, name: "agg_eps", kind: "message", oneof: "data", T: () => AggEps },
            { no: 8, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 9, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.more = "";
        message.data = { oneofKind: undefined };
        message.id = 0;
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Style module_style */ 2:
                    message.moduleStyle = Style.internalBinaryRead(reader, reader.uint32(), options, message.moduleStyle);
                    break;
                case /* string more */ 3:
                    message.more = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Activity activity */ 4:
                    message.data = {
                        oneofKind: "activity",
                        activity: Activity.internalBinaryRead(reader, reader.uint32(), options, message.data.activity)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Characters characters */ 5:
                    message.data = {
                        oneofKind: "characters",
                        characters: Characters.internalBinaryRead(reader, reader.uint32(), options, message.data.characters)
                    };
                    break;
                case /* bilibili.app.viewunite.common.TheatreHotTopic theatre_hot_topic */ 6:
                    message.data = {
                        oneofKind: "theatreHotTopic",
                        theatreHotTopic: TheatreHotTopic.internalBinaryRead(reader, reader.uint32(), options, message.data.theatreHotTopic)
                    };
                    break;
                case /* bilibili.app.viewunite.common.AggEps agg_eps */ 7:
                    message.data = {
                        oneofKind: "aggEps",
                        aggEps: AggEps.internalBinaryRead(reader, reader.uint32(), options, message.data.aggEps)
                    };
                    break;
                case /* int32 id */ 8:
                    message.id = reader.int32();
                    break;
                case /* map<string, string> report */ 9:
                    this.binaryReadMap9(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap9(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.DeliveryData.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* bilibili.app.viewunite.common.Style module_style = 2; */
        if (message.moduleStyle)
            Style.internalBinaryWrite(message.moduleStyle, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* string more = 3; */
        if (message.more !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.more);
        /* bilibili.app.viewunite.common.Activity activity = 4; */
        if (message.data.oneofKind === "activity")
            Activity.internalBinaryWrite(message.data.activity, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Characters characters = 5; */
        if (message.data.oneofKind === "characters")
            Characters.internalBinaryWrite(message.data.characters, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.TheatreHotTopic theatre_hot_topic = 6; */
        if (message.data.oneofKind === "theatreHotTopic")
            TheatreHotTopic.internalBinaryWrite(message.data.theatreHotTopic, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.AggEps agg_eps = 7; */
        if (message.data.oneofKind === "aggEps")
            AggEps.internalBinaryWrite(message.data.aggEps, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* int32 id = 8; */
        if (message.id !== 0)
            writer.tag(8, WireType.Varint).int32(message.id);
        /* map<string, string> report = 9; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(9, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.DeliveryData
 */
const DeliveryData = new DeliveryData$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Desc$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Desc", [
            { no: 1, name: "info", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.info = "";
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string info */ 1:
                    message.info = reader.string();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string info = 1; */
        if (message.info !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.info);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Desc
 */
const Desc = new Desc$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DescV2$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.DescV2", [
            { no: 1, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "uri", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "rid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.text = "";
        message.type = 0;
        message.uri = "";
        message.rid = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string text */ 1:
                    message.text = reader.string();
                    break;
                case /* int32 type */ 2:
                    message.type = reader.int32();
                    break;
                case /* string uri */ 3:
                    message.uri = reader.string();
                    break;
                case /* int64 rid = 4 [jstype = JS_NUMBER];*/ 4:
                    message.rid = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string text = 1; */
        if (message.text !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.text);
        /* int32 type = 2; */
        if (message.type !== 0)
            writer.tag(2, WireType.Varint).int32(message.type);
        /* string uri = 3; */
        if (message.uri !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.uri);
        /* int64 rid = 4 [jstype = JS_NUMBER]; */
        if (message.rid !== 0)
            writer.tag(4, WireType.Varint).int64(message.rid);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.DescV2
 */
const DescV2 = new DescV2$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Dimension$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Dimension", [
            { no: 1, name: "width", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "height", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "rotate", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.width = 0;
        message.height = 0;
        message.rotate = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 width = 1 [jstype = JS_NUMBER];*/ 1:
                    message.width = reader.int64().toNumber();
                    break;
                case /* int64 height = 2 [jstype = JS_NUMBER];*/ 2:
                    message.height = reader.int64().toNumber();
                    break;
                case /* int64 rotate = 3 [jstype = JS_NUMBER];*/ 3:
                    message.rotate = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 width = 1 [jstype = JS_NUMBER]; */
        if (message.width !== 0)
            writer.tag(1, WireType.Varint).int64(message.width);
        /* int64 height = 2 [jstype = JS_NUMBER]; */
        if (message.height !== 0)
            writer.tag(2, WireType.Varint).int64(message.height);
        /* int64 rotate = 3 [jstype = JS_NUMBER]; */
        if (message.rotate !== 0)
            writer.tag(3, WireType.Varint).int64(message.rotate);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Dimension
 */
const Dimension = new Dimension$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DislikeReasons$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.DislikeReasons", [
            { no: 1, name: "id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "rid", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "tag_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 5, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.mid = 0;
        message.rid = 0;
        message.tagId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 id = 1 [jstype = JS_NUMBER];*/ 1:
                    message.id = reader.int64().toNumber();
                    break;
                case /* int64 mid = 2 [jstype = JS_NUMBER];*/ 2:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* int32 rid */ 3:
                    message.rid = reader.int32();
                    break;
                case /* int64 tag_id = 4 [jstype = JS_NUMBER];*/ 4:
                    message.tagId = reader.int64().toNumber();
                    break;
                case /* string name */ 5:
                    message.name = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 id = 1 [jstype = JS_NUMBER]; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int64(message.id);
        /* int64 mid = 2 [jstype = JS_NUMBER]; */
        if (message.mid !== 0)
            writer.tag(2, WireType.Varint).int64(message.mid);
        /* int32 rid = 3; */
        if (message.rid !== 0)
            writer.tag(3, WireType.Varint).int32(message.rid);
        /* int64 tag_id = 4 [jstype = JS_NUMBER]; */
        if (message.tagId !== 0)
            writer.tag(4, WireType.Varint).int64(message.tagId);
        /* string name = 5; */
        if (message.name !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.DislikeReasons
 */
const DislikeReasons = new DislikeReasons$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FollowLayer$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.FollowLayer", [
            { no: 1, name: "staff", kind: "message", T: () => Staff },
            { no: 2, name: "desc", kind: "message", T: () => Desc },
            { no: 3, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.Staff staff */ 1:
                    message.staff = Staff.internalBinaryRead(reader, reader.uint32(), options, message.staff);
                    break;
                case /* bilibili.app.viewunite.common.Desc desc */ 2:
                    message.desc = Desc.internalBinaryRead(reader, reader.uint32(), options, message.desc);
                    break;
                case /* map<string, string> report */ 3:
                    this.binaryReadMap3(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap3(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.FollowLayer.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.Staff staff = 1; */
        if (message.staff)
            Staff.internalBinaryWrite(message.staff, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Desc desc = 2; */
        if (message.desc)
            Desc.internalBinaryWrite(message.desc, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* map<string, string> report = 3; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(3, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.FollowLayer
 */
const FollowLayer = new FollowLayer$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Headline$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Headline", [
            { no: 1, name: "label", kind: "message", T: () => Label },
            { no: 2, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.content = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.Label label */ 1:
                    message.label = Label.internalBinaryRead(reader, reader.uint32(), options, message.label);
                    break;
                case /* string content */ 2:
                    message.content = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.Label label = 1; */
        if (message.label)
            Label.internalBinaryWrite(message.label, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string content = 2; */
        if (message.content !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.content);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Headline
 */
const Headline = new Headline$Type();
// @generated message type with reflection information, may provide speed optimized methods
class HistoryNode$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.HistoryNode", [
            { no: 1, name: "node_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.nodeId = 0;
        message.title = "";
        message.cid = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 node_id = 1 [jstype = JS_NUMBER];*/ 1:
                    message.nodeId = reader.int64().toNumber();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* int64 cid = 3 [jstype = JS_NUMBER];*/ 3:
                    message.cid = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 node_id = 1 [jstype = JS_NUMBER]; */
        if (message.nodeId !== 0)
            writer.tag(1, WireType.Varint).int64(message.nodeId);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* int64 cid = 3 [jstype = JS_NUMBER]; */
        if (message.cid !== 0)
            writer.tag(3, WireType.Varint).int64(message.cid);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.HistoryNode
 */
const HistoryNode = new HistoryNode$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Honor$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Honor", [
            { no: 1, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "icon_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "text_extra", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "text_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "text_color_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "bg_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "bg_color_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "url_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "type", kind: "enum", T: () => ["bilibili.app.viewunite.common.HonorType", HonorType] },
            { no: 12, name: "honor_jump_type", kind: "enum", T: () => ["bilibili.app.viewunite.common.HonorJumpType", HonorJumpType] },
            { no: 13, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.icon = "";
        message.iconNight = "";
        message.text = "";
        message.textExtra = "";
        message.textColor = "";
        message.textColorNight = "";
        message.bgColor = "";
        message.bgColorNight = "";
        message.url = "";
        message.urlText = "";
        message.type = 0;
        message.honorJumpType = 0;
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string icon */ 1:
                    message.icon = reader.string();
                    break;
                case /* string icon_night */ 2:
                    message.iconNight = reader.string();
                    break;
                case /* string text */ 3:
                    message.text = reader.string();
                    break;
                case /* string text_extra */ 4:
                    message.textExtra = reader.string();
                    break;
                case /* string text_color */ 5:
                    message.textColor = reader.string();
                    break;
                case /* string text_color_night */ 6:
                    message.textColorNight = reader.string();
                    break;
                case /* string bg_color */ 7:
                    message.bgColor = reader.string();
                    break;
                case /* string bg_color_night */ 8:
                    message.bgColorNight = reader.string();
                    break;
                case /* string url */ 9:
                    message.url = reader.string();
                    break;
                case /* string url_text */ 10:
                    message.urlText = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.HonorType type */ 11:
                    message.type = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.HonorJumpType honor_jump_type */ 12:
                    message.honorJumpType = reader.int32();
                    break;
                case /* map<string, string> report */ 13:
                    this.binaryReadMap13(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap13(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.Honor.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* string icon = 1; */
        if (message.icon !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.icon);
        /* string icon_night = 2; */
        if (message.iconNight !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.iconNight);
        /* string text = 3; */
        if (message.text !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.text);
        /* string text_extra = 4; */
        if (message.textExtra !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.textExtra);
        /* string text_color = 5; */
        if (message.textColor !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.textColor);
        /* string text_color_night = 6; */
        if (message.textColorNight !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.textColorNight);
        /* string bg_color = 7; */
        if (message.bgColor !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.bgColor);
        /* string bg_color_night = 8; */
        if (message.bgColorNight !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.bgColorNight);
        /* string url = 9; */
        if (message.url !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.url);
        /* string url_text = 10; */
        if (message.urlText !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.urlText);
        /* bilibili.app.viewunite.common.HonorType type = 11; */
        if (message.type !== 0)
            writer.tag(11, WireType.Varint).int32(message.type);
        /* bilibili.app.viewunite.common.HonorJumpType honor_jump_type = 12; */
        if (message.honorJumpType !== 0)
            writer.tag(12, WireType.Varint).int32(message.honorJumpType);
        /* map<string, string> report = 13; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(13, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Honor
 */
const Honor = new Honor$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IconFont$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.IconFont", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.name = "";
        message.text = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 1:
                    message.name = reader.string();
                    break;
                case /* string text */ 2:
                    message.text = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        /* string text = 2; */
        if (message.text !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.text);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.IconFont
 */
new IconFont$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Interaction$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Interaction", [
            { no: 1, name: "ep_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "history_node", kind: "message", T: () => HistoryNode },
            { no: 3, name: "graph_version", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "msg", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "is_interaction", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.epId = 0;
        message.graphVersion = 0;
        message.msg = "";
        message.isInteraction = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 ep_id = 1 [jstype = JS_NUMBER];*/ 1:
                    message.epId = reader.int64().toNumber();
                    break;
                case /* bilibili.app.viewunite.common.HistoryNode history_node */ 2:
                    message.historyNode = HistoryNode.internalBinaryRead(reader, reader.uint32(), options, message.historyNode);
                    break;
                case /* int64 graph_version = 3 [jstype = JS_NUMBER];*/ 3:
                    message.graphVersion = reader.int64().toNumber();
                    break;
                case /* string msg */ 4:
                    message.msg = reader.string();
                    break;
                case /* bool is_interaction */ 5:
                    message.isInteraction = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 ep_id = 1 [jstype = JS_NUMBER]; */
        if (message.epId !== 0)
            writer.tag(1, WireType.Varint).int64(message.epId);
        /* bilibili.app.viewunite.common.HistoryNode history_node = 2; */
        if (message.historyNode)
            HistoryNode.internalBinaryWrite(message.historyNode, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* int64 graph_version = 3 [jstype = JS_NUMBER]; */
        if (message.graphVersion !== 0)
            writer.tag(3, WireType.Varint).int64(message.graphVersion);
        /* string msg = 4; */
        if (message.msg !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.msg);
        /* bool is_interaction = 5; */
        if (message.isInteraction !== false)
            writer.tag(5, WireType.Varint).bool(message.isInteraction);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Interaction
 */
const Interaction = new Interaction$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Item$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Item", [
            { no: 1, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.link = "";
        message.cover = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string link */ 1:
                    message.link = reader.string();
                    break;
                case /* string cover */ 2:
                    message.cover = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string link = 1; */
        if (message.link !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.link);
        /* string cover = 2; */
        if (message.cover !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.cover);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Item
 */
const Item = new Item$Type();
// @generated message type with reflection information, may provide speed optimized methods
class KingPos$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.KingPos", [
            { no: 1, name: "disable", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "enum", T: () => ["bilibili.app.viewunite.common.KingPositionType", KingPositionType] },
            { no: 4, name: "disable_toast", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "checked_post", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "like", kind: "message", oneof: "extend", T: () => LikeExtend },
            { no: 7, name: "coin", kind: "message", oneof: "extend", T: () => CoinExtend }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.disable = false;
        message.icon = "";
        message.type = 0;
        message.disableToast = "";
        message.checkedPost = "";
        message.extend = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool disable */ 1:
                    message.disable = reader.bool();
                    break;
                case /* string icon */ 2:
                    message.icon = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.KingPositionType type */ 3:
                    message.type = reader.int32();
                    break;
                case /* string disable_toast */ 4:
                    message.disableToast = reader.string();
                    break;
                case /* string checked_post */ 5:
                    message.checkedPost = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.LikeExtend like */ 6:
                    message.extend = {
                        oneofKind: "like",
                        like: LikeExtend.internalBinaryRead(reader, reader.uint32(), options, message.extend.like)
                    };
                    break;
                case /* bilibili.app.viewunite.common.CoinExtend coin */ 7:
                    message.extend = {
                        oneofKind: "coin",
                        coin: CoinExtend.internalBinaryRead(reader, reader.uint32(), options, message.extend.coin)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bool disable = 1; */
        if (message.disable !== false)
            writer.tag(1, WireType.Varint).bool(message.disable);
        /* string icon = 2; */
        if (message.icon !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.icon);
        /* bilibili.app.viewunite.common.KingPositionType type = 3; */
        if (message.type !== 0)
            writer.tag(3, WireType.Varint).int32(message.type);
        /* string disable_toast = 4; */
        if (message.disableToast !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.disableToast);
        /* string checked_post = 5; */
        if (message.checkedPost !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.checkedPost);
        /* bilibili.app.viewunite.common.LikeExtend like = 6; */
        if (message.extend.oneofKind === "like")
            LikeExtend.internalBinaryWrite(message.extend.like, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.CoinExtend coin = 7; */
        if (message.extend.oneofKind === "coin")
            CoinExtend.internalBinaryWrite(message.extend.coin, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.KingPos
 */
const KingPos = new KingPos$Type();
// @generated message type with reflection information, may provide speed optimized methods
class KingPosition$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.KingPosition", [
            { no: 1, name: "king_pos", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => KingPos },
            { no: 2, name: "extenf", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => KingPos }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.kingPos = [];
        message.extenf = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.KingPos king_pos */ 1:
                    message.kingPos.push(KingPos.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated bilibili.app.viewunite.common.KingPos extenf */ 2:
                    message.extenf.push(KingPos.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.KingPos king_pos = 1; */
        for (let i = 0; i < message.kingPos.length; i++)
            KingPos.internalBinaryWrite(message.kingPos[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.KingPos extenf = 2; */
        for (let i = 0; i < message.extenf.length; i++)
            KingPos.internalBinaryWrite(message.extenf[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.KingPosition
 */
const KingPosition = new KingPosition$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Label$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Label", [
            { no: 1, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "uri", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "icon_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "icon_width", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 6, name: "icon_height", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 7, name: "lottie", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "lottie_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.type = 0;
        message.uri = "";
        message.icon = "";
        message.iconNight = "";
        message.iconWidth = 0;
        message.iconHeight = 0;
        message.lottie = "";
        message.lottieNight = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 type */ 1:
                    message.type = reader.int32();
                    break;
                case /* string uri */ 2:
                    message.uri = reader.string();
                    break;
                case /* string icon */ 3:
                    message.icon = reader.string();
                    break;
                case /* string icon_night */ 4:
                    message.iconNight = reader.string();
                    break;
                case /* int64 icon_width = 5 [jstype = JS_NUMBER];*/ 5:
                    message.iconWidth = reader.int64().toNumber();
                    break;
                case /* int64 icon_height = 6 [jstype = JS_NUMBER];*/ 6:
                    message.iconHeight = reader.int64().toNumber();
                    break;
                case /* string lottie */ 7:
                    message.lottie = reader.string();
                    break;
                case /* string lottie_night */ 8:
                    message.lottieNight = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 type = 1; */
        if (message.type !== 0)
            writer.tag(1, WireType.Varint).int32(message.type);
        /* string uri = 2; */
        if (message.uri !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.uri);
        /* string icon = 3; */
        if (message.icon !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.icon);
        /* string icon_night = 4; */
        if (message.iconNight !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.iconNight);
        /* int64 icon_width = 5 [jstype = JS_NUMBER]; */
        if (message.iconWidth !== 0)
            writer.tag(5, WireType.Varint).int64(message.iconWidth);
        /* int64 icon_height = 6 [jstype = JS_NUMBER]; */
        if (message.iconHeight !== 0)
            writer.tag(6, WireType.Varint).int64(message.iconHeight);
        /* string lottie = 7; */
        if (message.lottie !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.lottie);
        /* string lottie_night = 8; */
        if (message.lottieNight !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.lottieNight);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Label
 */
const Label = new Label$Type();
// @generated message type with reflection information, may provide speed optimized methods
class LikeComment$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.LikeComment", [
            { no: 1, name: "reply", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.reply = "";
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string reply */ 1:
                    message.reply = reader.string();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string reply = 1; */
        if (message.reply !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.reply);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.LikeComment
 */
const LikeComment = new LikeComment$Type();
// @generated message type with reflection information, may provide speed optimized methods
class LikeExtend$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.LikeExtend", [
            { no: 1, name: "triple_like", kind: "message", T: () => UpLikeImg },
            { no: 2, name: "like_animation", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "player_animation", kind: "message", T: () => PlayerAnimation },
            { no: 4, name: "resource", kind: "message", T: () => ActivityResource }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.likeAnimation = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.UpLikeImg triple_like */ 1:
                    message.tripleLike = UpLikeImg.internalBinaryRead(reader, reader.uint32(), options, message.tripleLike);
                    break;
                case /* string like_animation */ 2:
                    message.likeAnimation = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.PlayerAnimation player_animation */ 3:
                    message.playerAnimation = PlayerAnimation.internalBinaryRead(reader, reader.uint32(), options, message.playerAnimation);
                    break;
                case /* bilibili.app.viewunite.common.ActivityResource resource */ 4:
                    message.resource = ActivityResource.internalBinaryRead(reader, reader.uint32(), options, message.resource);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.UpLikeImg triple_like = 1; */
        if (message.tripleLike)
            UpLikeImg.internalBinaryWrite(message.tripleLike, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string like_animation = 2; */
        if (message.likeAnimation !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.likeAnimation);
        /* bilibili.app.viewunite.common.PlayerAnimation player_animation = 3; */
        if (message.playerAnimation)
            PlayerAnimation.internalBinaryWrite(message.playerAnimation, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.ActivityResource resource = 4; */
        if (message.resource)
            ActivityResource.internalBinaryWrite(message.resource, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.LikeExtend
 */
const LikeExtend = new LikeExtend$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Live$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Live", [
            { no: 1, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "room_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "uri", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "endpage_uri", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.mid = 0;
        message.roomId = 0;
        message.uri = "";
        message.endpageUri = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 mid */ 1:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* int64 room_id */ 2:
                    message.roomId = reader.int64().toNumber();
                    break;
                case /* string uri */ 3:
                    message.uri = reader.string();
                    break;
                case /* string endpage_uri */ 4:
                    message.endpageUri = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 mid = 1; */
        if (message.mid !== 0)
            writer.tag(1, WireType.Varint).int64(message.mid);
        /* int64 room_id = 2; */
        if (message.roomId !== 0)
            writer.tag(2, WireType.Varint).int64(message.roomId);
        /* string uri = 3; */
        if (message.uri !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.uri);
        /* string endpage_uri = 4; */
        if (message.endpageUri !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.endpageUri);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Live
 */
new Live$Type();
// @generated message type with reflection information, may provide speed optimized methods
class LiveOrder$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.LiveOrder", [
            { no: 1, name: "sid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "live_plan_start_time", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "is_follow", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 5, name: "follow_count", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.sid = 0;
        message.text = "";
        message.livePlanStartTime = 0;
        message.isFollow = false;
        message.followCount = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 sid = 1 [jstype = JS_NUMBER];*/ 1:
                    message.sid = reader.int64().toNumber();
                    break;
                case /* string text */ 2:
                    message.text = reader.string();
                    break;
                case /* int64 live_plan_start_time = 3 [jstype = JS_NUMBER];*/ 3:
                    message.livePlanStartTime = reader.int64().toNumber();
                    break;
                case /* bool is_follow */ 4:
                    message.isFollow = reader.bool();
                    break;
                case /* int64 follow_count = 5 [jstype = JS_NUMBER];*/ 5:
                    message.followCount = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 sid = 1 [jstype = JS_NUMBER]; */
        if (message.sid !== 0)
            writer.tag(1, WireType.Varint).int64(message.sid);
        /* string text = 2; */
        if (message.text !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.text);
        /* int64 live_plan_start_time = 3 [jstype = JS_NUMBER]; */
        if (message.livePlanStartTime !== 0)
            writer.tag(3, WireType.Varint).int64(message.livePlanStartTime);
        /* bool is_follow = 4; */
        if (message.isFollow !== false)
            writer.tag(4, WireType.Varint).bool(message.isFollow);
        /* int64 follow_count = 5 [jstype = JS_NUMBER]; */
        if (message.followCount !== 0)
            writer.tag(5, WireType.Varint).int64(message.followCount);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.LiveOrder
 */
const LiveOrder = new LiveOrder$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Mine$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Mine", [
            { no: 1, name: "amount", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "rank", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "msg", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.amount = 0;
        message.rank = 0;
        message.msg = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* double amount */ 1:
                    message.amount = reader.double();
                    break;
                case /* int32 rank */ 2:
                    message.rank = reader.int32();
                    break;
                case /* string msg */ 3:
                    message.msg = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* double amount = 1; */
        if (message.amount !== 0)
            writer.tag(1, WireType.Bit64).double(message.amount);
        /* int32 rank = 2; */
        if (message.rank !== 0)
            writer.tag(2, WireType.Varint).int32(message.rank);
        /* string msg = 3; */
        if (message.msg !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.msg);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Mine
 */
const Mine = new Mine$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Module$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Module", [
            { no: 1, name: "type", kind: "enum", T: () => ["bilibili.app.viewunite.common.ModuleType", ModuleType] },
            { no: 2, name: "ogv_introduction", kind: "message", oneof: "data", T: () => OgvIntroduction },
            { no: 3, name: "ugc_introduction", kind: "message", oneof: "data", T: () => UgcIntroduction },
            { no: 4, name: "king_position", kind: "message", oneof: "data", T: () => KingPosition },
            { no: 5, name: "head_line", kind: "message", oneof: "data", T: () => Headline },
            { no: 6, name: "ogv_title", kind: "message", oneof: "data", T: () => OgvTitle },
            { no: 7, name: "honor", kind: "message", oneof: "data", T: () => Honor },
            { no: 8, name: "list", kind: "message", oneof: "data", T: () => UserList },
            { no: 9, name: "staffs", kind: "message", oneof: "data", T: () => Staffs },
            { no: 10, name: "activity_reserve", kind: "message", oneof: "data", T: () => ActivityReserve },
            { no: 11, name: "live_order", kind: "message", oneof: "data", T: () => LiveOrder },
            { no: 12, name: "section_data", kind: "message", oneof: "data", T: () => SectionData },
            { no: 13, name: "delivery_data", kind: "message", oneof: "data", T: () => DeliveryData },
            { no: 14, name: "follow_layer", kind: "message", oneof: "data", T: () => FollowLayer },
            { no: 15, name: "ogv_seasons", kind: "message", oneof: "data", T: () => OgvSeasons },
            { no: 16, name: "ugc_season", kind: "message", oneof: "data", T: () => UgcSeasons },
            { no: 17, name: "ogv_live_reserve", kind: "message", oneof: "data", T: () => OgvLiveReserve },
            { no: 18, name: "combination_ep", kind: "message", oneof: "data", T: () => CombinationEp },
            { no: 19, name: "sponsor", kind: "message", oneof: "data", T: () => Sponsor },
            { no: 20, name: "activity_entrance_module", kind: "message", oneof: "data", T: () => ActivityEntranceModule },
            { no: 21, name: "serial_season", kind: "message", oneof: "data", T: () => SerialSeason },
            { no: 22, name: "relates", kind: "message", oneof: "data", T: () => Relates },
            { no: 23, name: "banner", kind: "message", oneof: "data", T: () => Banner },
            { no: 24, name: "audio", kind: "message", oneof: "data", T: () => Audio },
            { no: 25, name: "like_comment", kind: "message", oneof: "data", T: () => LikeComment },
            { no: 26, name: "attention_recommend", kind: "message", oneof: "data", T: () => AttentionRecommend },
            { no: 27, name: "covenanter", kind: "message", oneof: "data", T: () => Covenanter }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.type = 0;
        message.data = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.ModuleType type */ 1:
                    message.type = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.OgvIntroduction ogv_introduction */ 2:
                    message.data = {
                        oneofKind: "ogvIntroduction",
                        ogvIntroduction: OgvIntroduction.internalBinaryRead(reader, reader.uint32(), options, message.data.ogvIntroduction)
                    };
                    break;
                case /* bilibili.app.viewunite.common.UgcIntroduction ugc_introduction */ 3:
                    message.data = {
                        oneofKind: "ugcIntroduction",
                        ugcIntroduction: UgcIntroduction.internalBinaryRead(reader, reader.uint32(), options, message.data.ugcIntroduction)
                    };
                    break;
                case /* bilibili.app.viewunite.common.KingPosition king_position */ 4:
                    message.data = {
                        oneofKind: "kingPosition",
                        kingPosition: KingPosition.internalBinaryRead(reader, reader.uint32(), options, message.data.kingPosition)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Headline head_line */ 5:
                    message.data = {
                        oneofKind: "headLine",
                        headLine: Headline.internalBinaryRead(reader, reader.uint32(), options, message.data.headLine)
                    };
                    break;
                case /* bilibili.app.viewunite.common.OgvTitle ogv_title */ 6:
                    message.data = {
                        oneofKind: "ogvTitle",
                        ogvTitle: OgvTitle.internalBinaryRead(reader, reader.uint32(), options, message.data.ogvTitle)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Honor honor */ 7:
                    message.data = {
                        oneofKind: "honor",
                        honor: Honor.internalBinaryRead(reader, reader.uint32(), options, message.data.honor)
                    };
                    break;
                case /* bilibili.app.viewunite.common.UserList list */ 8:
                    message.data = {
                        oneofKind: "list",
                        list: UserList.internalBinaryRead(reader, reader.uint32(), options, message.data.list)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Staffs staffs */ 9:
                    message.data = {
                        oneofKind: "staffs",
                        staffs: Staffs.internalBinaryRead(reader, reader.uint32(), options, message.data.staffs)
                    };
                    break;
                case /* bilibili.app.viewunite.common.ActivityReserve activity_reserve */ 10:
                    message.data = {
                        oneofKind: "activityReserve",
                        activityReserve: ActivityReserve.internalBinaryRead(reader, reader.uint32(), options, message.data.activityReserve)
                    };
                    break;
                case /* bilibili.app.viewunite.common.LiveOrder live_order */ 11:
                    message.data = {
                        oneofKind: "liveOrder",
                        liveOrder: LiveOrder.internalBinaryRead(reader, reader.uint32(), options, message.data.liveOrder)
                    };
                    break;
                case /* bilibili.app.viewunite.common.SectionData section_data */ 12:
                    message.data = {
                        oneofKind: "sectionData",
                        sectionData: SectionData.internalBinaryRead(reader, reader.uint32(), options, message.data.sectionData)
                    };
                    break;
                case /* bilibili.app.viewunite.common.DeliveryData delivery_data */ 13:
                    message.data = {
                        oneofKind: "deliveryData",
                        deliveryData: DeliveryData.internalBinaryRead(reader, reader.uint32(), options, message.data.deliveryData)
                    };
                    break;
                case /* bilibili.app.viewunite.common.FollowLayer follow_layer */ 14:
                    message.data = {
                        oneofKind: "followLayer",
                        followLayer: FollowLayer.internalBinaryRead(reader, reader.uint32(), options, message.data.followLayer)
                    };
                    break;
                case /* bilibili.app.viewunite.common.OgvSeasons ogv_seasons */ 15:
                    message.data = {
                        oneofKind: "ogvSeasons",
                        ogvSeasons: OgvSeasons.internalBinaryRead(reader, reader.uint32(), options, message.data.ogvSeasons)
                    };
                    break;
                case /* bilibili.app.viewunite.common.UgcSeasons ugc_season */ 16:
                    message.data = {
                        oneofKind: "ugcSeason",
                        ugcSeason: UgcSeasons.internalBinaryRead(reader, reader.uint32(), options, message.data.ugcSeason)
                    };
                    break;
                case /* bilibili.app.viewunite.common.OgvLiveReserve ogv_live_reserve */ 17:
                    message.data = {
                        oneofKind: "ogvLiveReserve",
                        ogvLiveReserve: OgvLiveReserve.internalBinaryRead(reader, reader.uint32(), options, message.data.ogvLiveReserve)
                    };
                    break;
                case /* bilibili.app.viewunite.common.CombinationEp combination_ep */ 18:
                    message.data = {
                        oneofKind: "combinationEp",
                        combinationEp: CombinationEp.internalBinaryRead(reader, reader.uint32(), options, message.data.combinationEp)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Sponsor sponsor */ 19:
                    message.data = {
                        oneofKind: "sponsor",
                        sponsor: Sponsor.internalBinaryRead(reader, reader.uint32(), options, message.data.sponsor)
                    };
                    break;
                case /* bilibili.app.viewunite.common.ActivityEntranceModule activity_entrance_module */ 20:
                    message.data = {
                        oneofKind: "activityEntranceModule",
                        activityEntranceModule: ActivityEntranceModule.internalBinaryRead(reader, reader.uint32(), options, message.data.activityEntranceModule)
                    };
                    break;
                case /* bilibili.app.viewunite.common.SerialSeason serial_season */ 21:
                    message.data = {
                        oneofKind: "serialSeason",
                        serialSeason: SerialSeason.internalBinaryRead(reader, reader.uint32(), options, message.data.serialSeason)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Relates relates */ 22:
                    message.data = {
                        oneofKind: "relates",
                        relates: Relates.internalBinaryRead(reader, reader.uint32(), options, message.data.relates)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Banner banner */ 23:
                    message.data = {
                        oneofKind: "banner",
                        banner: Banner.internalBinaryRead(reader, reader.uint32(), options, message.data.banner)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Audio audio */ 24:
                    message.data = {
                        oneofKind: "audio",
                        audio: Audio.internalBinaryRead(reader, reader.uint32(), options, message.data.audio)
                    };
                    break;
                case /* bilibili.app.viewunite.common.LikeComment like_comment */ 25:
                    message.data = {
                        oneofKind: "likeComment",
                        likeComment: LikeComment.internalBinaryRead(reader, reader.uint32(), options, message.data.likeComment)
                    };
                    break;
                case /* bilibili.app.viewunite.common.AttentionRecommend attention_recommend */ 26:
                    message.data = {
                        oneofKind: "attentionRecommend",
                        attentionRecommend: AttentionRecommend.internalBinaryRead(reader, reader.uint32(), options, message.data.attentionRecommend)
                    };
                    break;
                case /* bilibili.app.viewunite.common.Covenanter covenanter */ 27:
                    message.data = {
                        oneofKind: "covenanter",
                        covenanter: Covenanter.internalBinaryRead(reader, reader.uint32(), options, message.data.covenanter)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.ModuleType type = 1; */
        if (message.type !== 0)
            writer.tag(1, WireType.Varint).int32(message.type);
        /* bilibili.app.viewunite.common.OgvIntroduction ogv_introduction = 2; */
        if (message.data.oneofKind === "ogvIntroduction")
            OgvIntroduction.internalBinaryWrite(message.data.ogvIntroduction, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.UgcIntroduction ugc_introduction = 3; */
        if (message.data.oneofKind === "ugcIntroduction")
            UgcIntroduction.internalBinaryWrite(message.data.ugcIntroduction, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.KingPosition king_position = 4; */
        if (message.data.oneofKind === "kingPosition")
            KingPosition.internalBinaryWrite(message.data.kingPosition, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Headline head_line = 5; */
        if (message.data.oneofKind === "headLine")
            Headline.internalBinaryWrite(message.data.headLine, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.OgvTitle ogv_title = 6; */
        if (message.data.oneofKind === "ogvTitle")
            OgvTitle.internalBinaryWrite(message.data.ogvTitle, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Honor honor = 7; */
        if (message.data.oneofKind === "honor")
            Honor.internalBinaryWrite(message.data.honor, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.UserList list = 8; */
        if (message.data.oneofKind === "list")
            UserList.internalBinaryWrite(message.data.list, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Staffs staffs = 9; */
        if (message.data.oneofKind === "staffs")
            Staffs.internalBinaryWrite(message.data.staffs, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.ActivityReserve activity_reserve = 10; */
        if (message.data.oneofKind === "activityReserve")
            ActivityReserve.internalBinaryWrite(message.data.activityReserve, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.LiveOrder live_order = 11; */
        if (message.data.oneofKind === "liveOrder")
            LiveOrder.internalBinaryWrite(message.data.liveOrder, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.SectionData section_data = 12; */
        if (message.data.oneofKind === "sectionData")
            SectionData.internalBinaryWrite(message.data.sectionData, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.DeliveryData delivery_data = 13; */
        if (message.data.oneofKind === "deliveryData")
            DeliveryData.internalBinaryWrite(message.data.deliveryData, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.FollowLayer follow_layer = 14; */
        if (message.data.oneofKind === "followLayer")
            FollowLayer.internalBinaryWrite(message.data.followLayer, writer.tag(14, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.OgvSeasons ogv_seasons = 15; */
        if (message.data.oneofKind === "ogvSeasons")
            OgvSeasons.internalBinaryWrite(message.data.ogvSeasons, writer.tag(15, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.UgcSeasons ugc_season = 16; */
        if (message.data.oneofKind === "ugcSeason")
            UgcSeasons.internalBinaryWrite(message.data.ugcSeason, writer.tag(16, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.OgvLiveReserve ogv_live_reserve = 17; */
        if (message.data.oneofKind === "ogvLiveReserve")
            OgvLiveReserve.internalBinaryWrite(message.data.ogvLiveReserve, writer.tag(17, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.CombinationEp combination_ep = 18; */
        if (message.data.oneofKind === "combinationEp")
            CombinationEp.internalBinaryWrite(message.data.combinationEp, writer.tag(18, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Sponsor sponsor = 19; */
        if (message.data.oneofKind === "sponsor")
            Sponsor.internalBinaryWrite(message.data.sponsor, writer.tag(19, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.ActivityEntranceModule activity_entrance_module = 20; */
        if (message.data.oneofKind === "activityEntranceModule")
            ActivityEntranceModule.internalBinaryWrite(message.data.activityEntranceModule, writer.tag(20, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.SerialSeason serial_season = 21; */
        if (message.data.oneofKind === "serialSeason")
            SerialSeason.internalBinaryWrite(message.data.serialSeason, writer.tag(21, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Relates relates = 22; */
        if (message.data.oneofKind === "relates")
            Relates.internalBinaryWrite(message.data.relates, writer.tag(22, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Banner banner = 23; */
        if (message.data.oneofKind === "banner")
            Banner.internalBinaryWrite(message.data.banner, writer.tag(23, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Audio audio = 24; */
        if (message.data.oneofKind === "audio")
            Audio.internalBinaryWrite(message.data.audio, writer.tag(24, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.LikeComment like_comment = 25; */
        if (message.data.oneofKind === "likeComment")
            LikeComment.internalBinaryWrite(message.data.likeComment, writer.tag(25, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.AttentionRecommend attention_recommend = 26; */
        if (message.data.oneofKind === "attentionRecommend")
            AttentionRecommend.internalBinaryWrite(message.data.attentionRecommend, writer.tag(26, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Covenanter covenanter = 27; */
        if (message.data.oneofKind === "covenanter")
            Covenanter.internalBinaryWrite(message.data.covenanter, writer.tag(27, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Module
 */
new Module$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MultiViewEp$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.MultiViewEp", [
            { no: 1, name: "ep_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.epId = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 ep_id */ 1:
                    message.epId = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 ep_id = 1; */
        if (message.epId !== 0)
            writer.tag(1, WireType.Varint).int64(message.epId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.MultiViewEp
 */
const MultiViewEp = new MultiViewEp$Type();
// @generated message type with reflection information, may provide speed optimized methods
class NewEp$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.NewEp", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "is_new", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "more", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "index_show", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.title = "";
        message.desc = "";
        message.isNew = 0;
        message.more = "";
        message.cover = "";
        message.indexShow = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* string desc */ 3:
                    message.desc = reader.string();
                    break;
                case /* int32 is_new */ 4:
                    message.isNew = reader.int32();
                    break;
                case /* string more */ 5:
                    message.more = reader.string();
                    break;
                case /* string cover */ 6:
                    message.cover = reader.string();
                    break;
                case /* string index_show */ 7:
                    message.indexShow = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* string desc = 3; */
        if (message.desc !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.desc);
        /* int32 is_new = 4; */
        if (message.isNew !== 0)
            writer.tag(4, WireType.Varint).int32(message.isNew);
        /* string more = 5; */
        if (message.more !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.more);
        /* string cover = 6; */
        if (message.cover !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.cover);
        /* string index_show = 7; */
        if (message.indexShow !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.indexShow);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.NewEp
 */
const NewEp = new NewEp$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OfficialVerify$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.OfficialVerify", [
            { no: 1, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.type = 0;
        message.desc = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 type */ 1:
                    message.type = reader.int32();
                    break;
                case /* string desc */ 2:
                    message.desc = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 type = 1; */
        if (message.type !== 0)
            writer.tag(1, WireType.Varint).int32(message.type);
        /* string desc = 2; */
        if (message.desc !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.desc);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.OfficialVerify
 */
const OfficialVerify = new OfficialVerify$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OgvIntroduction$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.OgvIntroduction", [
            { no: 1, name: "followers", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "score", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "play_data", kind: "message", T: () => StatInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.followers = "";
        message.score = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string followers */ 1:
                    message.followers = reader.string();
                    break;
                case /* string score */ 2:
                    message.score = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.StatInfo play_data */ 3:
                    message.playData = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.playData);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string followers = 1; */
        if (message.followers !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.followers);
        /* string score = 2; */
        if (message.score !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.score);
        /* bilibili.app.viewunite.common.StatInfo play_data = 3; */
        if (message.playData)
            StatInfo.internalBinaryWrite(message.playData, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.OgvIntroduction
 */
const OgvIntroduction = new OgvIntroduction$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OgvLiveReserve$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.OgvLiveReserve", [
            { no: 1, name: "reserve_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "night_icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "click_button", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "follow_video_is_reserve_live", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "bg_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "night_bg_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "text_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "night_text_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "bt_bg_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 13, name: "bt_frame_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 14, name: "night_bt_bg_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "night_bt_frame_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 16, name: "active_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 17, name: "reserve_status", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 18, name: "bt_text_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 19, name: "night_bt_text_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 20, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.reserveId = 0;
        message.title = "";
        message.icon = "";
        message.nightIcon = "";
        message.clickButton = "";
        message.link = "";
        message.followVideoIsReserveLive = 0;
        message.bgColor = "";
        message.nightBgColor = "";
        message.textColor = "";
        message.nightTextColor = "";
        message.btBgColor = "";
        message.btFrameColor = "";
        message.nightBtBgColor = "";
        message.nightBtFrameColor = "";
        message.activeType = 0;
        message.reserveStatus = 0;
        message.btTextColor = "";
        message.nightBtTextColor = "";
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 reserve_id */ 1:
                    message.reserveId = reader.int64().toNumber();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* string icon */ 3:
                    message.icon = reader.string();
                    break;
                case /* string night_icon */ 4:
                    message.nightIcon = reader.string();
                    break;
                case /* string click_button */ 5:
                    message.clickButton = reader.string();
                    break;
                case /* string link */ 6:
                    message.link = reader.string();
                    break;
                case /* int32 follow_video_is_reserve_live */ 7:
                    message.followVideoIsReserveLive = reader.int32();
                    break;
                case /* string bg_color */ 8:
                    message.bgColor = reader.string();
                    break;
                case /* string night_bg_color */ 9:
                    message.nightBgColor = reader.string();
                    break;
                case /* string text_color */ 10:
                    message.textColor = reader.string();
                    break;
                case /* string night_text_color */ 11:
                    message.nightTextColor = reader.string();
                    break;
                case /* string bt_bg_color */ 12:
                    message.btBgColor = reader.string();
                    break;
                case /* string bt_frame_color */ 13:
                    message.btFrameColor = reader.string();
                    break;
                case /* string night_bt_bg_color */ 14:
                    message.nightBtBgColor = reader.string();
                    break;
                case /* string night_bt_frame_color */ 15:
                    message.nightBtFrameColor = reader.string();
                    break;
                case /* int32 active_type */ 16:
                    message.activeType = reader.int32();
                    break;
                case /* int32 reserve_status */ 17:
                    message.reserveStatus = reader.int32();
                    break;
                case /* string bt_text_color */ 18:
                    message.btTextColor = reader.string();
                    break;
                case /* string night_bt_text_color */ 19:
                    message.nightBtTextColor = reader.string();
                    break;
                case /* map<string, string> report */ 20:
                    this.binaryReadMap20(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap20(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.OgvLiveReserve.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 reserve_id = 1; */
        if (message.reserveId !== 0)
            writer.tag(1, WireType.Varint).int64(message.reserveId);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* string icon = 3; */
        if (message.icon !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.icon);
        /* string night_icon = 4; */
        if (message.nightIcon !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.nightIcon);
        /* string click_button = 5; */
        if (message.clickButton !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.clickButton);
        /* string link = 6; */
        if (message.link !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.link);
        /* int32 follow_video_is_reserve_live = 7; */
        if (message.followVideoIsReserveLive !== 0)
            writer.tag(7, WireType.Varint).int32(message.followVideoIsReserveLive);
        /* string bg_color = 8; */
        if (message.bgColor !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.bgColor);
        /* string night_bg_color = 9; */
        if (message.nightBgColor !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.nightBgColor);
        /* string text_color = 10; */
        if (message.textColor !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.textColor);
        /* string night_text_color = 11; */
        if (message.nightTextColor !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.nightTextColor);
        /* string bt_bg_color = 12; */
        if (message.btBgColor !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.btBgColor);
        /* string bt_frame_color = 13; */
        if (message.btFrameColor !== "")
            writer.tag(13, WireType.LengthDelimited).string(message.btFrameColor);
        /* string night_bt_bg_color = 14; */
        if (message.nightBtBgColor !== "")
            writer.tag(14, WireType.LengthDelimited).string(message.nightBtBgColor);
        /* string night_bt_frame_color = 15; */
        if (message.nightBtFrameColor !== "")
            writer.tag(15, WireType.LengthDelimited).string(message.nightBtFrameColor);
        /* int32 active_type = 16; */
        if (message.activeType !== 0)
            writer.tag(16, WireType.Varint).int32(message.activeType);
        /* int32 reserve_status = 17; */
        if (message.reserveStatus !== 0)
            writer.tag(17, WireType.Varint).int32(message.reserveStatus);
        /* string bt_text_color = 18; */
        if (message.btTextColor !== "")
            writer.tag(18, WireType.LengthDelimited).string(message.btTextColor);
        /* string night_bt_text_color = 19; */
        if (message.nightBtTextColor !== "")
            writer.tag(19, WireType.LengthDelimited).string(message.nightBtTextColor);
        /* map<string, string> report = 20; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(20, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.OgvLiveReserve
 */
const OgvLiveReserve = new OgvLiveReserve$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OgvSeasons$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.OgvSeasons", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "serial_season", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SerialSeason },
            { no: 3, name: "style", kind: "enum", T: () => ["bilibili.app.viewunite.common.SerialSeasonCoverStyle", SerialSeasonCoverStyle] }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.serialSeason = [];
        message.style = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.SerialSeason serial_season */ 2:
                    message.serialSeason.push(SerialSeason.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.SerialSeasonCoverStyle style */ 3:
                    message.style = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* repeated bilibili.app.viewunite.common.SerialSeason serial_season = 2; */
        for (let i = 0; i < message.serialSeason.length; i++)
            SerialSeason.internalBinaryWrite(message.serialSeason[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.SerialSeasonCoverStyle style = 3; */
        if (message.style !== 0)
            writer.tag(3, WireType.Varint).int32(message.style);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.OgvSeasons
 */
const OgvSeasons = new OgvSeasons$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OgvTitle$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.OgvTitle", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "badge_info", kind: "message", T: () => BadgeInfo },
            { no: 3, name: "is_show_btn_animation", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "follow_video_is_reserve_live", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "reserve_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 6, name: "title_delivery_button", kind: "message", T: () => TitleDeliveryButton }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.isShowBtnAnimation = 0;
        message.followVideoIsReserveLive = 0;
        message.reserveId = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo badge_info */ 2:
                    message.badgeInfo = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badgeInfo);
                    break;
                case /* int32 is_show_btn_animation */ 3:
                    message.isShowBtnAnimation = reader.int32();
                    break;
                case /* int32 follow_video_is_reserve_live */ 4:
                    message.followVideoIsReserveLive = reader.int32();
                    break;
                case /* int64 reserve_id */ 5:
                    message.reserveId = reader.int64().toNumber();
                    break;
                case /* bilibili.app.viewunite.common.TitleDeliveryButton title_delivery_button */ 6:
                    message.titleDeliveryButton = TitleDeliveryButton.internalBinaryRead(reader, reader.uint32(), options, message.titleDeliveryButton);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* bilibili.app.viewunite.common.BadgeInfo badge_info = 2; */
        if (message.badgeInfo)
            BadgeInfo.internalBinaryWrite(message.badgeInfo, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* int32 is_show_btn_animation = 3; */
        if (message.isShowBtnAnimation !== 0)
            writer.tag(3, WireType.Varint).int32(message.isShowBtnAnimation);
        /* int32 follow_video_is_reserve_live = 4; */
        if (message.followVideoIsReserveLive !== 0)
            writer.tag(4, WireType.Varint).int32(message.followVideoIsReserveLive);
        /* int64 reserve_id = 5; */
        if (message.reserveId !== 0)
            writer.tag(5, WireType.Varint).int64(message.reserveId);
        /* bilibili.app.viewunite.common.TitleDeliveryButton title_delivery_button = 6; */
        if (message.titleDeliveryButton)
            TitleDeliveryButton.internalBinaryWrite(message.titleDeliveryButton, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.OgvTitle
 */
const OgvTitle = new OgvTitle$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Owner$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Owner", [
            { no: 2, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "fans", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "arc_count", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "attention", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "attention_relation", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "pub_location", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "title_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "face", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 15, name: "fans_num", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 16, name: "assists", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.url = "";
        message.title = "";
        message.fans = "";
        message.arcCount = "";
        message.attention = 0;
        message.attentionRelation = 0;
        message.pubLocation = "";
        message.titleUrl = "";
        message.face = "";
        message.mid = 0;
        message.fansNum = 0;
        message.assists = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string url */ 2:
                    message.url = reader.string();
                    break;
                case /* string title */ 3:
                    message.title = reader.string();
                    break;
                case /* string fans */ 4:
                    message.fans = reader.string();
                    break;
                case /* string arc_count */ 5:
                    message.arcCount = reader.string();
                    break;
                case /* int32 attention */ 6:
                    message.attention = reader.int32();
                    break;
                case /* int32 attention_relation */ 7:
                    message.attentionRelation = reader.int32();
                    break;
                case /* string pub_location */ 8:
                    message.pubLocation = reader.string();
                    break;
                case /* string title_url */ 10:
                    message.titleUrl = reader.string();
                    break;
                case /* string face */ 11:
                    message.face = reader.string();
                    break;
                case /* int64 mid = 12 [jstype = JS_NUMBER];*/ 12:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* int64 fans_num = 15 [jstype = JS_NUMBER];*/ 15:
                    message.fansNum = reader.int64().toNumber();
                    break;
                case /* repeated int64 assists = 16 [jstype = JS_NUMBER];*/ 16:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.assists.push(reader.int64().toNumber());
                    else
                        message.assists.push(reader.int64().toNumber());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string url = 2; */
        if (message.url !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.url);
        /* string title = 3; */
        if (message.title !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.title);
        /* string fans = 4; */
        if (message.fans !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.fans);
        /* string arc_count = 5; */
        if (message.arcCount !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.arcCount);
        /* int32 attention = 6; */
        if (message.attention !== 0)
            writer.tag(6, WireType.Varint).int32(message.attention);
        /* int32 attention_relation = 7; */
        if (message.attentionRelation !== 0)
            writer.tag(7, WireType.Varint).int32(message.attentionRelation);
        /* string pub_location = 8; */
        if (message.pubLocation !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.pubLocation);
        /* string title_url = 10; */
        if (message.titleUrl !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.titleUrl);
        /* string face = 11; */
        if (message.face !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.face);
        /* int64 mid = 12 [jstype = JS_NUMBER]; */
        if (message.mid !== 0)
            writer.tag(12, WireType.Varint).int64(message.mid);
        /* int64 fans_num = 15 [jstype = JS_NUMBER]; */
        if (message.fansNum !== 0)
            writer.tag(15, WireType.Varint).int64(message.fansNum);
        /* repeated int64 assists = 16 [jstype = JS_NUMBER]; */
        if (message.assists.length) {
            writer.tag(16, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.assists.length; i++)
                writer.int64(message.assists[i]);
            writer.join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Owner
 */
const Owner = new Owner$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Page$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Page", [
            { no: 1, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "part", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "duration", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "dimension", kind: "message", T: () => Dimension },
            { no: 6, name: "dl_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "dl_subtitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.cid = 0;
        message.part = "";
        message.duration = 0;
        message.desc = "";
        message.dlTitle = "";
        message.dlSubtitle = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 cid */ 1:
                    message.cid = reader.int64().toNumber();
                    break;
                case /* string part */ 2:
                    message.part = reader.string();
                    break;
                case /* int64 duration */ 3:
                    message.duration = reader.int64().toNumber();
                    break;
                case /* string desc */ 4:
                    message.desc = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Dimension dimension */ 5:
                    message.dimension = Dimension.internalBinaryRead(reader, reader.uint32(), options, message.dimension);
                    break;
                case /* string dl_title */ 6:
                    message.dlTitle = reader.string();
                    break;
                case /* string dl_subtitle */ 7:
                    message.dlSubtitle = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 cid = 1; */
        if (message.cid !== 0)
            writer.tag(1, WireType.Varint).int64(message.cid);
        /* string part = 2; */
        if (message.part !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.part);
        /* int64 duration = 3; */
        if (message.duration !== 0)
            writer.tag(3, WireType.Varint).int64(message.duration);
        /* string desc = 4; */
        if (message.desc !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.desc);
        /* bilibili.app.viewunite.common.Dimension dimension = 5; */
        if (message.dimension)
            Dimension.internalBinaryWrite(message.dimension, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* string dl_title = 6; */
        if (message.dlTitle !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.dlTitle);
        /* string dl_subtitle = 7; */
        if (message.dlSubtitle !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.dlSubtitle);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Page
 */
const Page = new Page$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Pendant$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Pendant", [
            { no: 1, name: "pid", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "image", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.pid = 0;
        message.name = "";
        message.image = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 pid */ 1:
                    message.pid = reader.int32();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string image */ 3:
                    message.image = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 pid = 1; */
        if (message.pid !== 0)
            writer.tag(1, WireType.Varint).int32(message.pid);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string image = 3; */
        if (message.image !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.image);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Pendant
 */
const Pendant = new Pendant$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PlayerAnimation$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.PlayerAnimation", [
            { no: 1, name: "player_icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "player_triple_icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.playerIcon = "";
        message.playerTripleIcon = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string player_icon */ 1:
                    message.playerIcon = reader.string();
                    break;
                case /* string player_triple_icon */ 2:
                    message.playerTripleIcon = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string player_icon = 1; */
        if (message.playerIcon !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.playerIcon);
        /* string player_triple_icon = 2; */
        if (message.playerTripleIcon !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.playerTripleIcon);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.PlayerAnimation
 */
const PlayerAnimation = new PlayerAnimation$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PointActivity$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.PointActivity", [
            { no: 1, name: "tip", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.tip = "";
        message.content = "";
        message.link = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string tip */ 1:
                    message.tip = reader.string();
                    break;
                case /* string content */ 2:
                    message.content = reader.string();
                    break;
                case /* string link */ 3:
                    message.link = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string tip = 1; */
        if (message.tip !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.tip);
        /* string content = 2; */
        if (message.content !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.content);
        /* string link = 3; */
        if (message.link !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.link);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.PointActivity
 */
const PointActivity = new PointActivity$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PowerIconStyle$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.PowerIconStyle", [
            { no: 1, name: "icon_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "icon_night_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "icon_width", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "icon_height", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.iconUrl = "";
        message.iconNightUrl = "";
        message.iconWidth = 0;
        message.iconHeight = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string icon_url */ 1:
                    message.iconUrl = reader.string();
                    break;
                case /* string icon_night_url */ 2:
                    message.iconNightUrl = reader.string();
                    break;
                case /* int64 icon_width */ 3:
                    message.iconWidth = reader.int64().toNumber();
                    break;
                case /* int64 icon_height */ 4:
                    message.iconHeight = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string icon_url = 1; */
        if (message.iconUrl !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.iconUrl);
        /* string icon_night_url = 2; */
        if (message.iconNightUrl !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.iconNightUrl);
        /* int64 icon_width = 3; */
        if (message.iconWidth !== 0)
            writer.tag(3, WireType.Varint).int64(message.iconWidth);
        /* int64 icon_height = 4; */
        if (message.iconHeight !== 0)
            writer.tag(4, WireType.Varint).int64(message.iconHeight);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.PowerIconStyle
 */
const PowerIconStyle = new PowerIconStyle$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Rank$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Rank", [
            { no: 1, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "icon_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.icon = "";
        message.iconNight = "";
        message.text = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string icon */ 1:
                    message.icon = reader.string();
                    break;
                case /* string icon_night */ 2:
                    message.iconNight = reader.string();
                    break;
                case /* string text */ 3:
                    message.text = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string icon = 1; */
        if (message.icon !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.icon);
        /* string icon_night = 2; */
        if (message.iconNight !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.iconNight);
        /* string text = 3; */
        if (message.text !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.text);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Rank
 */
const Rank = new Rank$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RankInfo$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RankInfo", [
            { no: 1, name: "icon_url_night", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "icon_url_day", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "bkg_night_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "bkg_day_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "font_night_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "font_day_color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "rank_content", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "rank_link", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.iconUrlNight = "";
        message.iconUrlDay = "";
        message.bkgNightColor = "";
        message.bkgDayColor = "";
        message.fontNightColor = "";
        message.fontDayColor = "";
        message.rankContent = "";
        message.rankLink = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string icon_url_night */ 1:
                    message.iconUrlNight = reader.string();
                    break;
                case /* string icon_url_day */ 2:
                    message.iconUrlDay = reader.string();
                    break;
                case /* string bkg_night_color */ 3:
                    message.bkgNightColor = reader.string();
                    break;
                case /* string bkg_day_color */ 4:
                    message.bkgDayColor = reader.string();
                    break;
                case /* string font_night_color */ 5:
                    message.fontNightColor = reader.string();
                    break;
                case /* string font_day_color */ 6:
                    message.fontDayColor = reader.string();
                    break;
                case /* string rank_content */ 7:
                    message.rankContent = reader.string();
                    break;
                case /* string rank_link */ 8:
                    message.rankLink = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string icon_url_night = 1; */
        if (message.iconUrlNight !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.iconUrlNight);
        /* string icon_url_day = 2; */
        if (message.iconUrlDay !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.iconUrlDay);
        /* string bkg_night_color = 3; */
        if (message.bkgNightColor !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.bkgNightColor);
        /* string bkg_day_color = 4; */
        if (message.bkgDayColor !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.bkgDayColor);
        /* string font_night_color = 5; */
        if (message.fontNightColor !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.fontNightColor);
        /* string font_day_color = 6; */
        if (message.fontDayColor !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.fontDayColor);
        /* string rank_content = 7; */
        if (message.rankContent !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.rankContent);
        /* string rank_link = 8; */
        if (message.rankLink !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.rankLink);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RankInfo
 */
const RankInfo = new RankInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Rating$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Rating", [
            { no: 1, name: "score", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "count", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.score = "";
        message.count = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string score */ 1:
                    message.score = reader.string();
                    break;
                case /* int32 count */ 2:
                    message.count = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string score = 1; */
        if (message.score !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.score);
        /* int32 count = 2; */
        if (message.count !== 0)
            writer.tag(2, WireType.Varint).int32(message.count);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Rating
 */
const Rating = new Rating$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateAVCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateAVCard", [
            { no: 1, name: "duration", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "dimension", kind: "message", T: () => Dimension },
            { no: 4, name: "stat", kind: "message", T: () => Stat },
            { no: 5, name: "jump_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "show_up_name", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 7, name: "rcmd_reason", kind: "message", T: () => BadgeInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.duration = 0;
        message.cid = 0;
        message.jumpUrl = "";
        message.showUpName = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 duration */ 1:
                    message.duration = reader.int64().toNumber();
                    break;
                case /* int64 cid */ 2:
                    message.cid = reader.int64().toNumber();
                    break;
                case /* bilibili.app.viewunite.common.Dimension dimension */ 3:
                    message.dimension = Dimension.internalBinaryRead(reader, reader.uint32(), options, message.dimension);
                    break;
                case /* bilibili.app.viewunite.common.Stat stat */ 4:
                    message.stat = Stat.internalBinaryRead(reader, reader.uint32(), options, message.stat);
                    break;
                case /* string jump_url */ 5:
                    message.jumpUrl = reader.string();
                    break;
                case /* bool show_up_name */ 6:
                    message.showUpName = reader.bool();
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo rcmd_reason */ 7:
                    message.rcmdReason = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.rcmdReason);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 duration = 1; */
        if (message.duration !== 0)
            writer.tag(1, WireType.Varint).int64(message.duration);
        /* int64 cid = 2; */
        if (message.cid !== 0)
            writer.tag(2, WireType.Varint).int64(message.cid);
        /* bilibili.app.viewunite.common.Dimension dimension = 3; */
        if (message.dimension)
            Dimension.internalBinaryWrite(message.dimension, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Stat stat = 4; */
        if (message.stat)
            Stat.internalBinaryWrite(message.stat, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* string jump_url = 5; */
        if (message.jumpUrl !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.jumpUrl);
        /* bool show_up_name = 6; */
        if (message.showUpName !== false)
            writer.tag(6, WireType.Varint).bool(message.showUpName);
        /* bilibili.app.viewunite.common.BadgeInfo rcmd_reason = 7; */
        if (message.rcmdReason)
            BadgeInfo.internalBinaryWrite(message.rcmdReason, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateAVCard
 */
const RelateAVCard = new RelateAVCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateBangumiAvCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateBangumiAvCard", [
            { no: 1, name: "badge", kind: "message", T: () => BadgeInfo },
            { no: 2, name: "stat", kind: "message", T: () => Stat },
            { no: 3, name: "rating", kind: "message", T: () => Rating }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.BadgeInfo badge */ 1:
                    message.badge = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badge);
                    break;
                case /* bilibili.app.viewunite.common.Stat stat */ 2:
                    message.stat = Stat.internalBinaryRead(reader, reader.uint32(), options, message.stat);
                    break;
                case /* bilibili.app.viewunite.common.Rating rating */ 3:
                    message.rating = Rating.internalBinaryRead(reader, reader.uint32(), options, message.rating);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.BadgeInfo badge = 1; */
        if (message.badge)
            BadgeInfo.internalBinaryWrite(message.badge, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Stat stat = 2; */
        if (message.stat)
            Stat.internalBinaryWrite(message.stat, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Rating rating = 3; */
        if (message.rating)
            Rating.internalBinaryWrite(message.rating, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateBangumiAvCard
 */
const RelateBangumiAvCard = new RelateBangumiAvCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateBangumiCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateBangumiCard", [
            { no: 1, name: "season_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "season_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "new_ep", kind: "message", T: () => NewEp },
            { no: 4, name: "stat", kind: "message", T: () => Stat },
            { no: 5, name: "rating", kind: "message", T: () => Rating },
            { no: 6, name: "rcmd_reason", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "badge_info", kind: "message", T: () => BadgeInfo },
            { no: 8, name: "goto_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.seasonId = 0;
        message.seasonType = 0;
        message.rcmdReason = "";
        message.gotoType = "";
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 season_id */ 1:
                    message.seasonId = reader.int32();
                    break;
                case /* int32 season_type */ 2:
                    message.seasonType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.NewEp new_ep */ 3:
                    message.newEp = NewEp.internalBinaryRead(reader, reader.uint32(), options, message.newEp);
                    break;
                case /* bilibili.app.viewunite.common.Stat stat */ 4:
                    message.stat = Stat.internalBinaryRead(reader, reader.uint32(), options, message.stat);
                    break;
                case /* bilibili.app.viewunite.common.Rating rating */ 5:
                    message.rating = Rating.internalBinaryRead(reader, reader.uint32(), options, message.rating);
                    break;
                case /* string rcmd_reason */ 6:
                    message.rcmdReason = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo badge_info */ 7:
                    message.badgeInfo = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badgeInfo);
                    break;
                case /* string goto_type */ 8:
                    message.gotoType = reader.string();
                    break;
                case /* map<string, string> report */ 9:
                    this.binaryReadMap9(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap9(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.RelateBangumiCard.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 season_id = 1; */
        if (message.seasonId !== 0)
            writer.tag(1, WireType.Varint).int32(message.seasonId);
        /* int32 season_type = 2; */
        if (message.seasonType !== 0)
            writer.tag(2, WireType.Varint).int32(message.seasonType);
        /* bilibili.app.viewunite.common.NewEp new_ep = 3; */
        if (message.newEp)
            NewEp.internalBinaryWrite(message.newEp, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Stat stat = 4; */
        if (message.stat)
            Stat.internalBinaryWrite(message.stat, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Rating rating = 5; */
        if (message.rating)
            Rating.internalBinaryWrite(message.rating, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* string rcmd_reason = 6; */
        if (message.rcmdReason !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.rcmdReason);
        /* bilibili.app.viewunite.common.BadgeInfo badge_info = 7; */
        if (message.badgeInfo)
            BadgeInfo.internalBinaryWrite(message.badgeInfo, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* string goto_type = 8; */
        if (message.gotoType !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.gotoType);
        /* map<string, string> report = 9; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(9, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateBangumiCard
 */
const RelateBangumiCard = new RelateBangumiCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateBangumiResourceCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateBangumiResourceCard", [
            { no: 1, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "scover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "re_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "re_value", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "corner", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "card", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "siz", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "position", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 9, name: "rcmd_reason", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "label", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 12, name: "goto_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.type = 0;
        message.scover = "";
        message.reType = 0;
        message.reValue = "";
        message.corner = "";
        message.card = 0;
        message.siz = "";
        message.position = 0;
        message.rcmdReason = "";
        message.label = "";
        message.report = {};
        message.gotoType = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 type */ 1:
                    message.type = reader.int32();
                    break;
                case /* string scover */ 2:
                    message.scover = reader.string();
                    break;
                case /* int32 re_type */ 3:
                    message.reType = reader.int32();
                    break;
                case /* string re_value */ 4:
                    message.reValue = reader.string();
                    break;
                case /* string corner */ 5:
                    message.corner = reader.string();
                    break;
                case /* int32 card */ 6:
                    message.card = reader.int32();
                    break;
                case /* string siz */ 7:
                    message.siz = reader.string();
                    break;
                case /* int32 position */ 8:
                    message.position = reader.int32();
                    break;
                case /* string rcmd_reason */ 9:
                    message.rcmdReason = reader.string();
                    break;
                case /* string label */ 10:
                    message.label = reader.string();
                    break;
                case /* map<string, string> report */ 11:
                    this.binaryReadMap11(message.report, reader, options);
                    break;
                case /* string goto_type */ 12:
                    message.gotoType = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap11(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.RelateBangumiResourceCard.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 type = 1; */
        if (message.type !== 0)
            writer.tag(1, WireType.Varint).int32(message.type);
        /* string scover = 2; */
        if (message.scover !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.scover);
        /* int32 re_type = 3; */
        if (message.reType !== 0)
            writer.tag(3, WireType.Varint).int32(message.reType);
        /* string re_value = 4; */
        if (message.reValue !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.reValue);
        /* string corner = 5; */
        if (message.corner !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.corner);
        /* int32 card = 6; */
        if (message.card !== 0)
            writer.tag(6, WireType.Varint).int32(message.card);
        /* string siz = 7; */
        if (message.siz !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.siz);
        /* int32 position = 8; */
        if (message.position !== 0)
            writer.tag(8, WireType.Varint).int32(message.position);
        /* string rcmd_reason = 9; */
        if (message.rcmdReason !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.rcmdReason);
        /* string label = 10; */
        if (message.label !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.label);
        /* map<string, string> report = 11; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(11, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        /* string goto_type = 12; */
        if (message.gotoType !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.gotoType);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateBangumiResourceCard
 */
const RelateBangumiResourceCard = new RelateBangumiResourceCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateBangumiUgcCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateBangumiUgcCard", [
            { no: 1, name: "badge", kind: "message", T: () => BadgeInfo },
            { no: 2, name: "stat", kind: "message", T: () => Stat },
            { no: 3, name: "rating", kind: "message", T: () => Rating }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.BadgeInfo badge */ 1:
                    message.badge = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badge);
                    break;
                case /* bilibili.app.viewunite.common.Stat stat */ 2:
                    message.stat = Stat.internalBinaryRead(reader, reader.uint32(), options, message.stat);
                    break;
                case /* bilibili.app.viewunite.common.Rating rating */ 3:
                    message.rating = Rating.internalBinaryRead(reader, reader.uint32(), options, message.rating);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.BadgeInfo badge = 1; */
        if (message.badge)
            BadgeInfo.internalBinaryWrite(message.badge, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Stat stat = 2; */
        if (message.stat)
            Stat.internalBinaryWrite(message.stat, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Rating rating = 3; */
        if (message.rating)
            Rating.internalBinaryWrite(message.rating, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateBangumiUgcCard
 */
const RelateBangumiUgcCard = new RelateBangumiUgcCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateCard", [
            { no: 1, name: "relate_card_type", kind: "enum", T: () => ["bilibili.app.viewunite.common.RelateCardType", RelateCardType] },
            { no: 2, name: "av", kind: "message", oneof: "card", T: () => RelateAVCard },
            { no: 3, name: "bangumi", kind: "message", oneof: "card", T: () => RelateBangumiCard },
            { no: 4, name: "resource", kind: "message", oneof: "card", T: () => RelateBangumiResourceCard },
            { no: 5, name: "game", kind: "message", oneof: "card", T: () => RelateGameCard },
            { no: 6, name: "cm", kind: "message", oneof: "card", T: () => RelateCMCard },
            { no: 7, name: "live", kind: "message", oneof: "card", T: () => RelateLiveCard },
            { no: 8, name: "bangumi_av", kind: "message", oneof: "card", T: () => RelateBangumiAvCard },
            { no: 9, name: "ai_card", kind: "message", oneof: "card", T: () => RelatedAICard },
            { no: 13, name: "bangumi_ugc", kind: "message", oneof: "card", T: () => RelateBangumiUgcCard },
            { no: 14, name: "special", kind: "message", oneof: "card", T: () => RelateSpecial },
            { no: 10, name: "three_point", kind: "message", T: () => RelateThreePoint },
            { no: 11, name: "cm_stock", kind: "message", T: () => Any },
            { no: 12, name: "basic_info", kind: "message", T: () => CardBasicInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.relateCardType = 0;
        message.card = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.RelateCardType relate_card_type */ 1:
                    message.relateCardType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.RelateAVCard av */ 2:
                    message.card = {
                        oneofKind: "av",
                        av: RelateAVCard.internalBinaryRead(reader, reader.uint32(), options, message.card.av)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateBangumiCard bangumi */ 3:
                    message.card = {
                        oneofKind: "bangumi",
                        bangumi: RelateBangumiCard.internalBinaryRead(reader, reader.uint32(), options, message.card.bangumi)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateBangumiResourceCard resource */ 4:
                    message.card = {
                        oneofKind: "resource",
                        resource: RelateBangumiResourceCard.internalBinaryRead(reader, reader.uint32(), options, message.card.resource)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateGameCard game */ 5:
                    message.card = {
                        oneofKind: "game",
                        game: RelateGameCard.internalBinaryRead(reader, reader.uint32(), options, message.card.game)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateCMCard cm */ 6:
                    message.card = {
                        oneofKind: "cm",
                        cm: RelateCMCard.internalBinaryRead(reader, reader.uint32(), options, message.card.cm)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateLiveCard live */ 7:
                    message.card = {
                        oneofKind: "live",
                        live: RelateLiveCard.internalBinaryRead(reader, reader.uint32(), options, message.card.live)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateBangumiAvCard bangumi_av */ 8:
                    message.card = {
                        oneofKind: "bangumiAv",
                        bangumiAv: RelateBangumiAvCard.internalBinaryRead(reader, reader.uint32(), options, message.card.bangumiAv)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelatedAICard ai_card */ 9:
                    message.card = {
                        oneofKind: "aiCard",
                        aiCard: RelatedAICard.internalBinaryRead(reader, reader.uint32(), options, message.card.aiCard)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateBangumiUgcCard bangumi_ugc */ 13:
                    message.card = {
                        oneofKind: "bangumiUgc",
                        bangumiUgc: RelateBangumiUgcCard.internalBinaryRead(reader, reader.uint32(), options, message.card.bangumiUgc)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateSpecial special */ 14:
                    message.card = {
                        oneofKind: "special",
                        special: RelateSpecial.internalBinaryRead(reader, reader.uint32(), options, message.card.special)
                    };
                    break;
                case /* bilibili.app.viewunite.common.RelateThreePoint three_point */ 10:
                    message.threePoint = RelateThreePoint.internalBinaryRead(reader, reader.uint32(), options, message.threePoint);
                    break;
                case /* google.protobuf.Any cm_stock */ 11:
                    message.cmStock = Any.internalBinaryRead(reader, reader.uint32(), options, message.cmStock);
                    break;
                case /* bilibili.app.viewunite.common.CardBasicInfo basic_info */ 12:
                    message.basicInfo = CardBasicInfo.internalBinaryRead(reader, reader.uint32(), options, message.basicInfo);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.RelateCardType relate_card_type = 1; */
        if (message.relateCardType !== 0)
            writer.tag(1, WireType.Varint).int32(message.relateCardType);
        /* bilibili.app.viewunite.common.RelateAVCard av = 2; */
        if (message.card.oneofKind === "av")
            RelateAVCard.internalBinaryWrite(message.card.av, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateBangumiCard bangumi = 3; */
        if (message.card.oneofKind === "bangumi")
            RelateBangumiCard.internalBinaryWrite(message.card.bangumi, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateBangumiResourceCard resource = 4; */
        if (message.card.oneofKind === "resource")
            RelateBangumiResourceCard.internalBinaryWrite(message.card.resource, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateGameCard game = 5; */
        if (message.card.oneofKind === "game")
            RelateGameCard.internalBinaryWrite(message.card.game, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateCMCard cm = 6; */
        if (message.card.oneofKind === "cm")
            RelateCMCard.internalBinaryWrite(message.card.cm, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateLiveCard live = 7; */
        if (message.card.oneofKind === "live")
            RelateLiveCard.internalBinaryWrite(message.card.live, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateBangumiAvCard bangumi_av = 8; */
        if (message.card.oneofKind === "bangumiAv")
            RelateBangumiAvCard.internalBinaryWrite(message.card.bangumiAv, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelatedAICard ai_card = 9; */
        if (message.card.oneofKind === "aiCard")
            RelatedAICard.internalBinaryWrite(message.card.aiCard, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateBangumiUgcCard bangumi_ugc = 13; */
        if (message.card.oneofKind === "bangumiUgc")
            RelateBangumiUgcCard.internalBinaryWrite(message.card.bangumiUgc, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateSpecial special = 14; */
        if (message.card.oneofKind === "special")
            RelateSpecial.internalBinaryWrite(message.card.special, writer.tag(14, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateThreePoint three_point = 10; */
        if (message.threePoint)
            RelateThreePoint.internalBinaryWrite(message.threePoint, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Any cm_stock = 11; */
        if (message.cmStock)
            Any.internalBinaryWrite(message.cmStock, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.CardBasicInfo basic_info = 12; */
        if (message.basicInfo)
            CardBasicInfo.internalBinaryWrite(message.basicInfo, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateCard
 */
const RelateCard = new RelateCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateCMCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateCMCard", [
            { no: 1, name: "aid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "source_content", kind: "message", T: () => Any },
            { no: 3, name: "duration", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "stat", kind: "message", T: () => Stat }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.aid = 0;
        message.duration = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 aid */ 1:
                    message.aid = reader.int64().toNumber();
                    break;
                case /* google.protobuf.Any source_content */ 2:
                    message.sourceContent = Any.internalBinaryRead(reader, reader.uint32(), options, message.sourceContent);
                    break;
                case /* int64 duration */ 3:
                    message.duration = reader.int64().toNumber();
                    break;
                case /* bilibili.app.viewunite.common.Stat stat */ 4:
                    message.stat = Stat.internalBinaryRead(reader, reader.uint32(), options, message.stat);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 aid = 1; */
        if (message.aid !== 0)
            writer.tag(1, WireType.Varint).int64(message.aid);
        /* google.protobuf.Any source_content = 2; */
        if (message.sourceContent)
            Any.internalBinaryWrite(message.sourceContent, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* int64 duration = 3; */
        if (message.duration !== 0)
            writer.tag(3, WireType.Varint).int64(message.duration);
        /* bilibili.app.viewunite.common.Stat stat = 4; */
        if (message.stat)
            Stat.internalBinaryWrite(message.stat, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateCMCard
 */
const RelateCMCard = new RelateCMCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateConfig$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateConfig", [
            { no: 1, name: "valid_show_m", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "valid_show_n", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "pagination", kind: "message", T: () => Pagination },
            { no: 4, name: "can_load_more", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.validShowM = 0;
        message.validShowN = 0;
        message.canLoadMore = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 valid_show_m */ 1:
                    message.validShowM = reader.int64().toNumber();
                    break;
                case /* int64 valid_show_n */ 2:
                    message.validShowN = reader.int64().toNumber();
                    break;
                case /* bilibili.pagination.Pagination pagination */ 3:
                    message.pagination = Pagination.internalBinaryRead(reader, reader.uint32(), options, message.pagination);
                    break;
                case /* bool can_load_more */ 4:
                    message.canLoadMore = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 valid_show_m = 1; */
        if (message.validShowM !== 0)
            writer.tag(1, WireType.Varint).int64(message.validShowM);
        /* int64 valid_show_n = 2; */
        if (message.validShowN !== 0)
            writer.tag(2, WireType.Varint).int64(message.validShowN);
        /* bilibili.pagination.Pagination pagination = 3; */
        if (message.pagination)
            Pagination.internalBinaryWrite(message.pagination, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bool can_load_more = 4; */
        if (message.canLoadMore !== false)
            writer.tag(4, WireType.Varint).bool(message.canLoadMore);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateConfig
 */
const RelateConfig = new RelateConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelatedAICard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelatedAICard", [
            { no: 1, name: "aid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "duration", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "up_info", kind: "message", T: () => Staff },
            { no: 4, name: "stat", kind: "message", T: () => Stat },
            { no: 5, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 6, name: "goto_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.aid = 0;
        message.duration = 0;
        message.report = {};
        message.gotoType = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 aid */ 1:
                    message.aid = reader.int64().toNumber();
                    break;
                case /* int64 duration */ 2:
                    message.duration = reader.int64().toNumber();
                    break;
                case /* bilibili.app.viewunite.common.Staff up_info */ 3:
                    message.upInfo = Staff.internalBinaryRead(reader, reader.uint32(), options, message.upInfo);
                    break;
                case /* bilibili.app.viewunite.common.Stat stat */ 4:
                    message.stat = Stat.internalBinaryRead(reader, reader.uint32(), options, message.stat);
                    break;
                case /* map<string, string> report */ 5:
                    this.binaryReadMap5(message.report, reader, options);
                    break;
                case /* string goto_type */ 6:
                    message.gotoType = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap5(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.RelatedAICard.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 aid = 1; */
        if (message.aid !== 0)
            writer.tag(1, WireType.Varint).int64(message.aid);
        /* int64 duration = 2; */
        if (message.duration !== 0)
            writer.tag(2, WireType.Varint).int64(message.duration);
        /* bilibili.app.viewunite.common.Staff up_info = 3; */
        if (message.upInfo)
            Staff.internalBinaryWrite(message.upInfo, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Stat stat = 4; */
        if (message.stat)
            Stat.internalBinaryWrite(message.stat, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* map<string, string> report = 5; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(5, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        /* string goto_type = 6; */
        if (message.gotoType !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.gotoType);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelatedAICard
 */
const RelatedAICard = new RelatedAICard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateDislike$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateDislike", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "sub_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "closed_sub_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "paste_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "closed_paste_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "dislike_reason", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => DislikeReasons },
            { no: 7, name: "toast", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "closed_toast", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.subTitle = "";
        message.closedSubTitle = "";
        message.pasteText = "";
        message.closedPasteText = "";
        message.dislikeReason = [];
        message.toast = "";
        message.closedToast = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* string sub_title */ 2:
                    message.subTitle = reader.string();
                    break;
                case /* string closed_sub_title */ 3:
                    message.closedSubTitle = reader.string();
                    break;
                case /* string paste_text */ 4:
                    message.pasteText = reader.string();
                    break;
                case /* string closed_paste_text */ 5:
                    message.closedPasteText = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.DislikeReasons dislike_reason */ 6:
                    message.dislikeReason.push(DislikeReasons.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string toast */ 7:
                    message.toast = reader.string();
                    break;
                case /* string closed_toast */ 8:
                    message.closedToast = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* string sub_title = 2; */
        if (message.subTitle !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.subTitle);
        /* string closed_sub_title = 3; */
        if (message.closedSubTitle !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.closedSubTitle);
        /* string paste_text = 4; */
        if (message.pasteText !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.pasteText);
        /* string closed_paste_text = 5; */
        if (message.closedPasteText !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.closedPasteText);
        /* repeated bilibili.app.viewunite.common.DislikeReasons dislike_reason = 6; */
        for (let i = 0; i < message.dislikeReason.length; i++)
            DislikeReasons.internalBinaryWrite(message.dislikeReason[i], writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* string toast = 7; */
        if (message.toast !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.toast);
        /* string closed_toast = 8; */
        if (message.closedToast !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.closedToast);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateDislike
 */
const RelateDislike = new RelateDislike$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateGameCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateGameCard", [
            { no: 1, name: "reserve_status", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "reserve_status_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "reserve", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "rating", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ },
            { no: 5, name: "tag_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "rank_info", kind: "message", T: () => RankInfo },
            { no: 7, name: "pack_info", kind: "message", T: () => Button },
            { no: 8, name: "notice", kind: "message", T: () => Button },
            { no: 9, name: "power_icon_style", kind: "message", T: () => PowerIconStyle },
            { no: 10, name: "game_rcmd_reason", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "wiki_info", kind: "message", T: () => WikiInfo },
            { no: 12, name: "badge", kind: "message", T: () => BadgeInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.reserveStatus = 0;
        message.reserveStatusText = "";
        message.reserve = "";
        message.rating = 0;
        message.tagName = "";
        message.gameRcmdReason = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 reserve_status */ 1:
                    message.reserveStatus = reader.int64().toNumber();
                    break;
                case /* string reserve_status_text */ 2:
                    message.reserveStatusText = reader.string();
                    break;
                case /* string reserve */ 3:
                    message.reserve = reader.string();
                    break;
                case /* float rating */ 4:
                    message.rating = reader.float();
                    break;
                case /* string tag_name */ 5:
                    message.tagName = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.RankInfo rank_info */ 6:
                    message.rankInfo = RankInfo.internalBinaryRead(reader, reader.uint32(), options, message.rankInfo);
                    break;
                case /* bilibili.app.viewunite.common.Button pack_info */ 7:
                    message.packInfo = Button.internalBinaryRead(reader, reader.uint32(), options, message.packInfo);
                    break;
                case /* bilibili.app.viewunite.common.Button notice */ 8:
                    message.notice = Button.internalBinaryRead(reader, reader.uint32(), options, message.notice);
                    break;
                case /* bilibili.app.viewunite.common.PowerIconStyle power_icon_style */ 9:
                    message.powerIconStyle = PowerIconStyle.internalBinaryRead(reader, reader.uint32(), options, message.powerIconStyle);
                    break;
                case /* string game_rcmd_reason */ 10:
                    message.gameRcmdReason = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.WikiInfo wiki_info */ 11:
                    message.wikiInfo = WikiInfo.internalBinaryRead(reader, reader.uint32(), options, message.wikiInfo);
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo badge */ 12:
                    message.badge = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badge);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 reserve_status = 1; */
        if (message.reserveStatus !== 0)
            writer.tag(1, WireType.Varint).int64(message.reserveStatus);
        /* string reserve_status_text = 2; */
        if (message.reserveStatusText !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.reserveStatusText);
        /* string reserve = 3; */
        if (message.reserve !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.reserve);
        /* float rating = 4; */
        if (message.rating !== 0)
            writer.tag(4, WireType.Bit32).float(message.rating);
        /* string tag_name = 5; */
        if (message.tagName !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.tagName);
        /* bilibili.app.viewunite.common.RankInfo rank_info = 6; */
        if (message.rankInfo)
            RankInfo.internalBinaryWrite(message.rankInfo, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Button pack_info = 7; */
        if (message.packInfo)
            Button.internalBinaryWrite(message.packInfo, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Button notice = 8; */
        if (message.notice)
            Button.internalBinaryWrite(message.notice, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.PowerIconStyle power_icon_style = 9; */
        if (message.powerIconStyle)
            PowerIconStyle.internalBinaryWrite(message.powerIconStyle, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* string game_rcmd_reason = 10; */
        if (message.gameRcmdReason !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.gameRcmdReason);
        /* bilibili.app.viewunite.common.WikiInfo wiki_info = 11; */
        if (message.wikiInfo)
            WikiInfo.internalBinaryWrite(message.wikiInfo, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.BadgeInfo badge = 12; */
        if (message.badge)
            BadgeInfo.internalBinaryWrite(message.badge, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateGameCard
 */
const RelateGameCard = new RelateGameCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateItem$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateItem", [
            { no: 1, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "use_default_browser", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.url = "";
        message.cover = "";
        message.useDefaultBrowser = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string url */ 1:
                    message.url = reader.string();
                    break;
                case /* string cover */ 2:
                    message.cover = reader.string();
                    break;
                case /* bool use_default_browser */ 3:
                    message.useDefaultBrowser = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string url = 1; */
        if (message.url !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.url);
        /* string cover = 2; */
        if (message.cover !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.cover);
        /* bool use_default_browser = 3; */
        if (message.useDefaultBrowser !== false)
            writer.tag(3, WireType.Varint).bool(message.useDefaultBrowser);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateItem
 */
const RelateItem = new RelateItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateLiveCard$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateLiveCard", [
            { no: 1, name: "icon_type", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "area_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "watched_show", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "live_status", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.iconType = 0;
        message.areaName = "";
        message.watchedShow = 0;
        message.liveStatus = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 icon_type */ 1:
                    message.iconType = reader.int64().toNumber();
                    break;
                case /* string area_name */ 2:
                    message.areaName = reader.string();
                    break;
                case /* int64 watched_show */ 3:
                    message.watchedShow = reader.int64().toNumber();
                    break;
                case /* int64 live_status */ 4:
                    message.liveStatus = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 icon_type = 1; */
        if (message.iconType !== 0)
            writer.tag(1, WireType.Varint).int64(message.iconType);
        /* string area_name = 2; */
        if (message.areaName !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.areaName);
        /* int64 watched_show = 3; */
        if (message.watchedShow !== 0)
            writer.tag(3, WireType.Varint).int64(message.watchedShow);
        /* int64 live_status = 4; */
        if (message.liveStatus !== 0)
            writer.tag(4, WireType.Varint).int64(message.liveStatus);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateLiveCard
 */
const RelateLiveCard = new RelateLiveCard$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Relates$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Relates", [
            { no: 1, name: "cards", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => RelateCard },
            { no: 2, name: "config", kind: "message", T: () => RelateConfig }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.cards = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.RelateCard cards */ 1:
                    message.cards.push(RelateCard.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.RelateConfig config */ 2:
                    message.config = RelateConfig.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.RelateCard cards = 1; */
        for (let i = 0; i < message.cards.length; i++)
            RelateCard.internalBinaryWrite(message.cards[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateConfig config = 2; */
        if (message.config)
            RelateConfig.internalBinaryWrite(message.config, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Relates
 */
const Relates = new Relates$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateSpecial$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateSpecial", [
            { no: 1, name: "badge", kind: "message", T: () => BadgeInfo },
            { no: 2, name: "rcmd_reason", kind: "message", T: () => BadgeInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.BadgeInfo badge */ 1:
                    message.badge = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badge);
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo rcmd_reason */ 2:
                    message.rcmdReason = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.rcmdReason);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.BadgeInfo badge = 1; */
        if (message.badge)
            BadgeInfo.internalBinaryWrite(message.badge, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.BadgeInfo rcmd_reason = 2; */
        if (message.rcmdReason)
            BadgeInfo.internalBinaryWrite(message.rcmdReason, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateSpecial
 */
const RelateSpecial = new RelateSpecial$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelateThreePoint$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.RelateThreePoint", [
            { no: 1, name: "dislike", kind: "message", T: () => RelateDislike },
            { no: 2, name: "feedback", kind: "message", T: () => RelateDislike },
            { no: 3, name: "watch_later", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "dislike_report_data", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.watchLater = false;
        message.dislikeReportData = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.RelateDislike dislike */ 1:
                    message.dislike = RelateDislike.internalBinaryRead(reader, reader.uint32(), options, message.dislike);
                    break;
                case /* bilibili.app.viewunite.common.RelateDislike feedback */ 2:
                    message.feedback = RelateDislike.internalBinaryRead(reader, reader.uint32(), options, message.feedback);
                    break;
                case /* bool watch_later */ 3:
                    message.watchLater = reader.bool();
                    break;
                case /* string dislike_report_data */ 4:
                    message.dislikeReportData = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.RelateDislike dislike = 1; */
        if (message.dislike)
            RelateDislike.internalBinaryWrite(message.dislike, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.RelateDislike feedback = 2; */
        if (message.feedback)
            RelateDislike.internalBinaryWrite(message.feedback, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bool watch_later = 3; */
        if (message.watchLater !== false)
            writer.tag(3, WireType.Varint).bool(message.watchLater);
        /* string dislike_report_data = 4; */
        if (message.dislikeReportData !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.dislikeReportData);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.RelateThreePoint
 */
const RelateThreePoint = new RelateThreePoint$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReserveButton$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ReserveButton", [
            { no: 1, name: "status", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "selected_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "order_type", kind: "enum", T: () => ["bilibili.app.viewunite.common.ReserveBizType", ReserveBizType] },
            { no: 8, name: "reserve", kind: "message", oneof: "orderParam", T: () => BizReserveActivityParam },
            { no: 9, name: "fav", kind: "message", oneof: "orderParam", T: () => BizFavParam }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.status = false;
        message.text = "";
        message.selectedText = "";
        message.orderType = 0;
        message.orderParam = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool status */ 1:
                    message.status = reader.bool();
                    break;
                case /* string text */ 3:
                    message.text = reader.string();
                    break;
                case /* string selected_text */ 4:
                    message.selectedText = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.ReserveBizType order_type */ 7:
                    message.orderType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.BizReserveActivityParam reserve */ 8:
                    message.orderParam = {
                        oneofKind: "reserve",
                        reserve: BizReserveActivityParam.internalBinaryRead(reader, reader.uint32(), options, message.orderParam.reserve)
                    };
                    break;
                case /* bilibili.app.viewunite.common.BizFavParam fav */ 9:
                    message.orderParam = {
                        oneofKind: "fav",
                        fav: BizFavParam.internalBinaryRead(reader, reader.uint32(), options, message.orderParam.fav)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bool status = 1; */
        if (message.status !== false)
            writer.tag(1, WireType.Varint).bool(message.status);
        /* string text = 3; */
        if (message.text !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.text);
        /* string selected_text = 4; */
        if (message.selectedText !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.selectedText);
        /* bilibili.app.viewunite.common.ReserveBizType order_type = 7; */
        if (message.orderType !== 0)
            writer.tag(7, WireType.Varint).int32(message.orderType);
        /* bilibili.app.viewunite.common.BizReserveActivityParam reserve = 8; */
        if (message.orderParam.oneofKind === "reserve")
            BizReserveActivityParam.internalBinaryWrite(message.orderParam.reserve, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.BizFavParam fav = 9; */
        if (message.orderParam.oneofKind === "fav")
            BizFavParam.internalBinaryWrite(message.orderParam.fav, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ReserveButton
 */
const ReserveButton = new ReserveButton$Type();
// @generated message type with reflection information, may provide speed optimized methods
let Rights$Type$1 = class Rights$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Rights", [
            { no: 1, name: "allow_download", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "allow_review", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "can_watch", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "resource", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "allow_dm", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "allow_demand", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "area_limit", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.allowDownload = 0;
        message.allowReview = 0;
        message.canWatch = 0;
        message.resource = "";
        message.allowDm = 0;
        message.allowDemand = 0;
        message.areaLimit = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 allow_download */ 1:
                    message.allowDownload = reader.int32();
                    break;
                case /* int32 allow_review */ 2:
                    message.allowReview = reader.int32();
                    break;
                case /* int32 can_watch */ 3:
                    message.canWatch = reader.int32();
                    break;
                case /* string resource */ 4:
                    message.resource = reader.string();
                    break;
                case /* int32 allow_dm */ 5:
                    message.allowDm = reader.int32();
                    break;
                case /* int32 allow_demand */ 6:
                    message.allowDemand = reader.int32();
                    break;
                case /* int32 area_limit */ 7:
                    message.areaLimit = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 allow_download = 1; */
        if (message.allowDownload !== 0)
            writer.tag(1, WireType.Varint).int32(message.allowDownload);
        /* int32 allow_review = 2; */
        if (message.allowReview !== 0)
            writer.tag(2, WireType.Varint).int32(message.allowReview);
        /* int32 can_watch = 3; */
        if (message.canWatch !== 0)
            writer.tag(3, WireType.Varint).int32(message.canWatch);
        /* string resource = 4; */
        if (message.resource !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.resource);
        /* int32 allow_dm = 5; */
        if (message.allowDm !== 0)
            writer.tag(5, WireType.Varint).int32(message.allowDm);
        /* int32 allow_demand = 6; */
        if (message.allowDemand !== 0)
            writer.tag(6, WireType.Varint).int32(message.allowDemand);
        /* int32 area_limit = 7; */
        if (message.areaLimit !== 0)
            writer.tag(7, WireType.Varint).int32(message.areaLimit);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
};
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Rights
 */
const Rights$1 = new Rights$Type$1();
// @generated message type with reflection information, may provide speed optimized methods
class SeasonHead$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.SeasonHead", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "intro", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "vt", kind: "message", T: () => StatInfo },
            { no: 4, name: "danmaku", kind: "message", T: () => StatInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        message.intro = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                case /* string intro */ 2:
                    message.intro = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.StatInfo vt */ 3:
                    message.vt = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.vt);
                    break;
                case /* bilibili.app.viewunite.common.StatInfo danmaku */ 4:
                    message.danmaku = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.danmaku);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        /* string intro = 2; */
        if (message.intro !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.intro);
        /* bilibili.app.viewunite.common.StatInfo vt = 3; */
        if (message.vt)
            StatInfo.internalBinaryWrite(message.vt, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.StatInfo danmaku = 4; */
        if (message.danmaku)
            StatInfo.internalBinaryWrite(message.danmaku, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.SeasonHead
 */
const SeasonHead = new SeasonHead$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SeasonShow$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.SeasonShow", [
            { no: 1, name: "button_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "join_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "rule_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "checkin_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "checkin_prompt", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.buttonText = "";
        message.joinText = "";
        message.ruleText = "";
        message.checkinText = "";
        message.checkinPrompt = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string button_text */ 1:
                    message.buttonText = reader.string();
                    break;
                case /* string join_text */ 2:
                    message.joinText = reader.string();
                    break;
                case /* string rule_text */ 3:
                    message.ruleText = reader.string();
                    break;
                case /* string checkin_text */ 4:
                    message.checkinText = reader.string();
                    break;
                case /* string checkin_prompt */ 5:
                    message.checkinPrompt = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string button_text = 1; */
        if (message.buttonText !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.buttonText);
        /* string join_text = 2; */
        if (message.joinText !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.joinText);
        /* string rule_text = 3; */
        if (message.ruleText !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.ruleText);
        /* string checkin_text = 4; */
        if (message.checkinText !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.checkinText);
        /* string checkin_prompt = 5; */
        if (message.checkinPrompt !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.checkinPrompt);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.SeasonShow
 */
const SeasonShow = new SeasonShow$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SectionData$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.SectionData", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "section_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "can_ord_desc", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "more", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "episode_ids", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "episodes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ViewEpisode },
            { no: 8, name: "split_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "module_style", kind: "message", T: () => Style },
            { no: 10, name: "more_bottom_desc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "seasons", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SerialSeason },
            { no: 12, name: "more_left", kind: "message", T: () => Button },
            { no: 13, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 14, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.sectionId = 0;
        message.title = "";
        message.canOrdDesc = 0;
        message.more = "";
        message.episodeIds = [];
        message.episodes = [];
        message.splitText = "";
        message.moreBottomDesc = "";
        message.seasons = [];
        message.type = 0;
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* int32 section_id */ 2:
                    message.sectionId = reader.int32();
                    break;
                case /* string title */ 3:
                    message.title = reader.string();
                    break;
                case /* int32 can_ord_desc */ 4:
                    message.canOrdDesc = reader.int32();
                    break;
                case /* string more */ 5:
                    message.more = reader.string();
                    break;
                case /* repeated int32 episode_ids */ 6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.episodeIds.push(reader.int32());
                    else
                        message.episodeIds.push(reader.int32());
                    break;
                case /* repeated bilibili.app.viewunite.common.ViewEpisode episodes */ 7:
                    message.episodes.push(ViewEpisode.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string split_text */ 8:
                    message.splitText = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Style module_style */ 9:
                    message.moduleStyle = Style.internalBinaryRead(reader, reader.uint32(), options, message.moduleStyle);
                    break;
                case /* string more_bottom_desc */ 10:
                    message.moreBottomDesc = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.SerialSeason seasons */ 11:
                    message.seasons.push(SerialSeason.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.Button more_left */ 12:
                    message.moreLeft = Button.internalBinaryRead(reader, reader.uint32(), options, message.moreLeft);
                    break;
                case /* int32 type */ 13:
                    message.type = reader.int32();
                    break;
                case /* map<string, string> report */ 14:
                    this.binaryReadMap14(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap14(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.SectionData.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* int32 section_id = 2; */
        if (message.sectionId !== 0)
            writer.tag(2, WireType.Varint).int32(message.sectionId);
        /* string title = 3; */
        if (message.title !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.title);
        /* int32 can_ord_desc = 4; */
        if (message.canOrdDesc !== 0)
            writer.tag(4, WireType.Varint).int32(message.canOrdDesc);
        /* string more = 5; */
        if (message.more !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.more);
        /* repeated int32 episode_ids = 6; */
        if (message.episodeIds.length) {
            writer.tag(6, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.episodeIds.length; i++)
                writer.int32(message.episodeIds[i]);
            writer.join();
        }
        /* repeated bilibili.app.viewunite.common.ViewEpisode episodes = 7; */
        for (let i = 0; i < message.episodes.length; i++)
            ViewEpisode.internalBinaryWrite(message.episodes[i], writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* string split_text = 8; */
        if (message.splitText !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.splitText);
        /* bilibili.app.viewunite.common.Style module_style = 9; */
        if (message.moduleStyle)
            Style.internalBinaryWrite(message.moduleStyle, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* string more_bottom_desc = 10; */
        if (message.moreBottomDesc !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.moreBottomDesc);
        /* repeated bilibili.app.viewunite.common.SerialSeason seasons = 11; */
        for (let i = 0; i < message.seasons.length; i++)
            SerialSeason.internalBinaryWrite(message.seasons[i], writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Button more_left = 12; */
        if (message.moreLeft)
            Button.internalBinaryWrite(message.moreLeft, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        /* int32 type = 13; */
        if (message.type !== 0)
            writer.tag(13, WireType.Varint).int32(message.type);
        /* map<string, string> report = 14; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(14, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.SectionData
 */
const SectionData = new SectionData$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SerialSeason$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.SerialSeason", [
            { no: 1, name: "season_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "season_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "is_new", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "badge", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "badge_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "badge_info", kind: "message", T: () => BadgeInfo },
            { no: 9, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "resource", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "new_ep", kind: "message", T: () => NewEp }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.seasonId = 0;
        message.title = "";
        message.seasonTitle = "";
        message.isNew = 0;
        message.cover = "";
        message.badge = "";
        message.badgeType = 0;
        message.link = "";
        message.resource = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 season_id */ 1:
                    message.seasonId = reader.int32();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* string season_title */ 3:
                    message.seasonTitle = reader.string();
                    break;
                case /* int32 is_new */ 4:
                    message.isNew = reader.int32();
                    break;
                case /* string cover */ 5:
                    message.cover = reader.string();
                    break;
                case /* string badge */ 6:
                    message.badge = reader.string();
                    break;
                case /* int32 badge_type */ 7:
                    message.badgeType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo badge_info */ 8:
                    message.badgeInfo = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badgeInfo);
                    break;
                case /* string link */ 9:
                    message.link = reader.string();
                    break;
                case /* string resource */ 10:
                    message.resource = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.NewEp new_ep */ 11:
                    message.newEp = NewEp.internalBinaryRead(reader, reader.uint32(), options, message.newEp);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 season_id = 1; */
        if (message.seasonId !== 0)
            writer.tag(1, WireType.Varint).int32(message.seasonId);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* string season_title = 3; */
        if (message.seasonTitle !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.seasonTitle);
        /* int32 is_new = 4; */
        if (message.isNew !== 0)
            writer.tag(4, WireType.Varint).int32(message.isNew);
        /* string cover = 5; */
        if (message.cover !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.cover);
        /* string badge = 6; */
        if (message.badge !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.badge);
        /* int32 badge_type = 7; */
        if (message.badgeType !== 0)
            writer.tag(7, WireType.Varint).int32(message.badgeType);
        /* bilibili.app.viewunite.common.BadgeInfo badge_info = 8; */
        if (message.badgeInfo)
            BadgeInfo.internalBinaryWrite(message.badgeInfo, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* string link = 9; */
        if (message.link !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.link);
        /* string resource = 10; */
        if (message.resource !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.resource);
        /* bilibili.app.viewunite.common.NewEp new_ep = 11; */
        if (message.newEp)
            NewEp.internalBinaryWrite(message.newEp, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.SerialSeason
 */
const SerialSeason = new SerialSeason$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SkipRange$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.SkipRange", [
            { no: 1, name: "start", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "end", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.start = 0;
        message.end = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 start */ 1:
                    message.start = reader.int32();
                    break;
                case /* int32 end */ 2:
                    message.end = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 start = 1; */
        if (message.start !== 0)
            writer.tag(1, WireType.Varint).int32(message.start);
        /* int32 end = 2; */
        if (message.end !== 0)
            writer.tag(2, WireType.Varint).int32(message.end);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.SkipRange
 */
new SkipRange$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Sponsor$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Sponsor", [
            { no: 1, name: "total", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "week", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "rank_list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SponsorRank },
            { no: 4, name: "mine", kind: "message", T: () => Mine },
            { no: 5, name: "point_activity", kind: "message", T: () => PointActivity },
            { no: 6, name: "pendants", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Pendant },
            { no: 7, name: "threshold", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Threshold }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.total = 0;
        message.week = 0;
        message.rankList = [];
        message.pendants = [];
        message.threshold = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 total */ 1:
                    message.total = reader.int64().toNumber();
                    break;
                case /* int64 week */ 2:
                    message.week = reader.int64().toNumber();
                    break;
                case /* repeated bilibili.app.viewunite.common.SponsorRank rank_list */ 3:
                    message.rankList.push(SponsorRank.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.Mine mine */ 4:
                    message.mine = Mine.internalBinaryRead(reader, reader.uint32(), options, message.mine);
                    break;
                case /* bilibili.app.viewunite.common.PointActivity point_activity */ 5:
                    message.pointActivity = PointActivity.internalBinaryRead(reader, reader.uint32(), options, message.pointActivity);
                    break;
                case /* repeated bilibili.app.viewunite.common.Pendant pendants */ 6:
                    message.pendants.push(Pendant.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated bilibili.app.viewunite.common.Threshold threshold */ 7:
                    message.threshold.push(Threshold.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 total = 1; */
        if (message.total !== 0)
            writer.tag(1, WireType.Varint).int64(message.total);
        /* int64 week = 2; */
        if (message.week !== 0)
            writer.tag(2, WireType.Varint).int64(message.week);
        /* repeated bilibili.app.viewunite.common.SponsorRank rank_list = 3; */
        for (let i = 0; i < message.rankList.length; i++)
            SponsorRank.internalBinaryWrite(message.rankList[i], writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Mine mine = 4; */
        if (message.mine)
            Mine.internalBinaryWrite(message.mine, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.PointActivity point_activity = 5; */
        if (message.pointActivity)
            PointActivity.internalBinaryWrite(message.pointActivity, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.Pendant pendants = 6; */
        for (let i = 0; i < message.pendants.length; i++)
            Pendant.internalBinaryWrite(message.pendants[i], writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.Threshold threshold = 7; */
        for (let i = 0; i < message.threshold.length; i++)
            Threshold.internalBinaryWrite(message.threshold[i], writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Sponsor
 */
const Sponsor = new Sponsor$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SponsorRank$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.SponsorRank", [
            { no: 1, name: "uid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "msg", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "uname", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "face", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "vip", kind: "message", T: () => Vip }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.uid = 0;
        message.msg = "";
        message.uname = "";
        message.face = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 uid */ 1:
                    message.uid = reader.int64().toNumber();
                    break;
                case /* string msg */ 2:
                    message.msg = reader.string();
                    break;
                case /* string uname */ 3:
                    message.uname = reader.string();
                    break;
                case /* string face */ 4:
                    message.face = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Vip vip */ 5:
                    message.vip = Vip.internalBinaryRead(reader, reader.uint32(), options, message.vip);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 uid = 1; */
        if (message.uid !== 0)
            writer.tag(1, WireType.Varint).int64(message.uid);
        /* string msg = 2; */
        if (message.msg !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.msg);
        /* string uname = 3; */
        if (message.uname !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.uname);
        /* string face = 4; */
        if (message.face !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.face);
        /* bilibili.app.viewunite.common.Vip vip = 5; */
        if (message.vip)
            Vip.internalBinaryWrite(message.vip, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.SponsorRank
 */
const SponsorRank = new SponsorRank$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Staff$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Staff", [
            { no: 1, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "attention", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "face", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "official", kind: "message", T: () => OfficialVerify },
            { no: 7, name: "vip", kind: "message", T: () => Vip },
            { no: 8, name: "label_style", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 9, name: "fans", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.mid = 0;
        message.attention = 0;
        message.title = "";
        message.name = "";
        message.face = "";
        message.labelStyle = 0;
        message.fans = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 mid */ 1:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* int32 attention */ 2:
                    message.attention = reader.int32();
                    break;
                case /* string title */ 3:
                    message.title = reader.string();
                    break;
                case /* string name */ 4:
                    message.name = reader.string();
                    break;
                case /* string face */ 5:
                    message.face = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.OfficialVerify official */ 6:
                    message.official = OfficialVerify.internalBinaryRead(reader, reader.uint32(), options, message.official);
                    break;
                case /* bilibili.app.viewunite.common.Vip vip */ 7:
                    message.vip = Vip.internalBinaryRead(reader, reader.uint32(), options, message.vip);
                    break;
                case /* int32 label_style */ 8:
                    message.labelStyle = reader.int32();
                    break;
                case /* string fans */ 9:
                    message.fans = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 mid = 1; */
        if (message.mid !== 0)
            writer.tag(1, WireType.Varint).int64(message.mid);
        /* int32 attention = 2; */
        if (message.attention !== 0)
            writer.tag(2, WireType.Varint).int32(message.attention);
        /* string title = 3; */
        if (message.title !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.title);
        /* string name = 4; */
        if (message.name !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.name);
        /* string face = 5; */
        if (message.face !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.face);
        /* bilibili.app.viewunite.common.OfficialVerify official = 6; */
        if (message.official)
            OfficialVerify.internalBinaryWrite(message.official, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Vip vip = 7; */
        if (message.vip)
            Vip.internalBinaryWrite(message.vip, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* int32 label_style = 8; */
        if (message.labelStyle !== 0)
            writer.tag(8, WireType.Varint).int32(message.labelStyle);
        /* string fans = 9; */
        if (message.fans !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.fans);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Staff
 */
const Staff = new Staff$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Staffs$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Staffs", [
            { no: 1, name: "staff", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Staff },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.staff = [];
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.Staff staff */ 1:
                    message.staff.push(Staff.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.Staff staff = 1; */
        for (let i = 0; i < message.staff.length; i++)
            Staff.internalBinaryWrite(message.staff[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Staffs
 */
const Staffs = new Staffs$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Stat$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Stat", [
            { no: 1, name: "vt", kind: "message", T: () => StatInfo },
            { no: 2, name: "danmaku", kind: "message", T: () => StatInfo },
            { no: 3, name: "reply", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "fav", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 5, name: "coin", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 6, name: "share", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 7, name: "like", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 8, name: "follow", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.reply = 0;
        message.fav = 0;
        message.coin = 0;
        message.share = 0;
        message.like = 0;
        message.follow = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.common.StatInfo vt */ 1:
                    message.vt = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.vt);
                    break;
                case /* bilibili.app.viewunite.common.StatInfo danmaku */ 2:
                    message.danmaku = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.danmaku);
                    break;
                case /* int64 reply */ 3:
                    message.reply = reader.int64().toNumber();
                    break;
                case /* int64 fav */ 4:
                    message.fav = reader.int64().toNumber();
                    break;
                case /* int64 coin */ 5:
                    message.coin = reader.int64().toNumber();
                    break;
                case /* int64 share */ 6:
                    message.share = reader.int64().toNumber();
                    break;
                case /* int64 like */ 7:
                    message.like = reader.int64().toNumber();
                    break;
                case /* int64 follow */ 8:
                    message.follow = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.common.StatInfo vt = 1; */
        if (message.vt)
            StatInfo.internalBinaryWrite(message.vt, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.StatInfo danmaku = 2; */
        if (message.danmaku)
            StatInfo.internalBinaryWrite(message.danmaku, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* int64 reply = 3; */
        if (message.reply !== 0)
            writer.tag(3, WireType.Varint).int64(message.reply);
        /* int64 fav = 4; */
        if (message.fav !== 0)
            writer.tag(4, WireType.Varint).int64(message.fav);
        /* int64 coin = 5; */
        if (message.coin !== 0)
            writer.tag(5, WireType.Varint).int64(message.coin);
        /* int64 share = 6; */
        if (message.share !== 0)
            writer.tag(6, WireType.Varint).int64(message.share);
        /* int64 like = 7; */
        if (message.like !== 0)
            writer.tag(7, WireType.Varint).int64(message.like);
        /* int64 follow = 8; */
        if (message.follow !== 0)
            writer.tag(8, WireType.Varint).int64(message.follow);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Stat
 */
const Stat = new Stat$Type();
// @generated message type with reflection information, may provide speed optimized methods
class StatInfo$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.StatInfo", [
            { no: 1, name: "value", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "pure_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.value = 0;
        message.text = "";
        message.pureText = "";
        message.icon = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 value */ 1:
                    message.value = reader.int64().toNumber();
                    break;
                case /* string text */ 2:
                    message.text = reader.string();
                    break;
                case /* string pure_text */ 3:
                    message.pureText = reader.string();
                    break;
                case /* string icon */ 4:
                    message.icon = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 value = 1; */
        if (message.value !== 0)
            writer.tag(1, WireType.Varint).int64(message.value);
        /* string text = 2; */
        if (message.text !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.text);
        /* string pure_text = 3; */
        if (message.pureText !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.pureText);
        /* string icon = 4; */
        if (message.icon !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.icon);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.StatInfo
 */
const StatInfo = new StatInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Style$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Style", [
            { no: 1, name: "line", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "hidden", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "show_pages", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.line = 0;
        message.hidden = 0;
        message.showPages = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 line */ 1:
                    message.line = reader.int32();
                    break;
                case /* int32 hidden */ 2:
                    message.hidden = reader.int32();
                    break;
                case /* repeated string show_pages */ 3:
                    message.showPages.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 line = 1; */
        if (message.line !== 0)
            writer.tag(1, WireType.Varint).int32(message.line);
        /* int32 hidden = 2; */
        if (message.hidden !== 0)
            writer.tag(2, WireType.Varint).int32(message.hidden);
        /* repeated string show_pages = 3; */
        for (let i = 0; i < message.showPages.length; i++)
            writer.tag(3, WireType.LengthDelimited).string(message.showPages[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Style
 */
const Style = new Style$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Tag$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Tag", [
            { no: 1, name: "tag_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "uri", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "tag_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.tagId = 0;
        message.name = "";
        message.uri = "";
        message.tagType = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 tag_id */ 1:
                    message.tagId = reader.int64().toNumber();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string uri */ 3:
                    message.uri = reader.string();
                    break;
                case /* string tag_type */ 4:
                    message.tagType = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 tag_id = 1; */
        if (message.tagId !== 0)
            writer.tag(1, WireType.Varint).int64(message.tagId);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string uri = 3; */
        if (message.uri !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.uri);
        /* string tag_type = 4; */
        if (message.tagType !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.tagType);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Tag
 */
const Tag = new Tag$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TheatreHotTopic$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.TheatreHotTopic", [
            { no: 1, name: "theatre_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "theatre_set_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "theatre_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "background_image_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "theatre_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "hot_topic_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 7, name: "hot_topic_set_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 8, name: "hot_topic_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "hot_topic_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "is_subscribe", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 11, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.theatreId = 0;
        message.theatreSetId = 0;
        message.theatreTitle = "";
        message.backgroundImageUrl = "";
        message.theatreUrl = "";
        message.hotTopicId = 0;
        message.hotTopicSetId = 0;
        message.hotTopicTitle = "";
        message.hotTopicUrl = "";
        message.isSubscribe = 0;
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 theatre_id */ 1:
                    message.theatreId = reader.int64().toNumber();
                    break;
                case /* int64 theatre_set_id */ 2:
                    message.theatreSetId = reader.int64().toNumber();
                    break;
                case /* string theatre_title */ 3:
                    message.theatreTitle = reader.string();
                    break;
                case /* string background_image_url */ 4:
                    message.backgroundImageUrl = reader.string();
                    break;
                case /* string theatre_url */ 5:
                    message.theatreUrl = reader.string();
                    break;
                case /* int64 hot_topic_id */ 6:
                    message.hotTopicId = reader.int64().toNumber();
                    break;
                case /* int64 hot_topic_set_id */ 7:
                    message.hotTopicSetId = reader.int64().toNumber();
                    break;
                case /* string hot_topic_title */ 8:
                    message.hotTopicTitle = reader.string();
                    break;
                case /* string hot_topic_url */ 9:
                    message.hotTopicUrl = reader.string();
                    break;
                case /* int32 is_subscribe */ 10:
                    message.isSubscribe = reader.int32();
                    break;
                case /* map<string, string> report */ 11:
                    this.binaryReadMap11(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap11(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.TheatreHotTopic.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 theatre_id = 1; */
        if (message.theatreId !== 0)
            writer.tag(1, WireType.Varint).int64(message.theatreId);
        /* int64 theatre_set_id = 2; */
        if (message.theatreSetId !== 0)
            writer.tag(2, WireType.Varint).int64(message.theatreSetId);
        /* string theatre_title = 3; */
        if (message.theatreTitle !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.theatreTitle);
        /* string background_image_url = 4; */
        if (message.backgroundImageUrl !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.backgroundImageUrl);
        /* string theatre_url = 5; */
        if (message.theatreUrl !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.theatreUrl);
        /* int64 hot_topic_id = 6; */
        if (message.hotTopicId !== 0)
            writer.tag(6, WireType.Varint).int64(message.hotTopicId);
        /* int64 hot_topic_set_id = 7; */
        if (message.hotTopicSetId !== 0)
            writer.tag(7, WireType.Varint).int64(message.hotTopicSetId);
        /* string hot_topic_title = 8; */
        if (message.hotTopicTitle !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.hotTopicTitle);
        /* string hot_topic_url = 9; */
        if (message.hotTopicUrl !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.hotTopicUrl);
        /* int32 is_subscribe = 10; */
        if (message.isSubscribe !== 0)
            writer.tag(10, WireType.Varint).int32(message.isSubscribe);
        /* map<string, string> report = 11; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(11, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.TheatreHotTopic
 */
const TheatreHotTopic = new TheatreHotTopic$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Threshold$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Threshold", [
            { no: 1, name: "bp", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "days", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "days_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.bp = 0;
        message.days = 0;
        message.daysText = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 bp */ 1:
                    message.bp = reader.int32();
                    break;
                case /* int32 days */ 2:
                    message.days = reader.int32();
                    break;
                case /* string days_text */ 3:
                    message.daysText = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 bp = 1; */
        if (message.bp !== 0)
            writer.tag(1, WireType.Varint).int32(message.bp);
        /* int32 days = 2; */
        if (message.days !== 0)
            writer.tag(2, WireType.Varint).int32(message.days);
        /* string days_text = 3; */
        if (message.daysText !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.daysText);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Threshold
 */
const Threshold = new Threshold$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TitleDeliveryButton$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.TitleDeliveryButton", [
            { no: 1, name: "icon", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.icon = "";
        message.title = "";
        message.link = "";
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string icon */ 1:
                    message.icon = reader.string();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* string link */ 3:
                    message.link = reader.string();
                    break;
                case /* map<string, string> report */ 4:
                    this.binaryReadMap4(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap4(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.TitleDeliveryButton.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* string icon = 1; */
        if (message.icon !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.icon);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* string link = 3; */
        if (message.link !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.link);
        /* map<string, string> report = 4; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(4, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.TitleDeliveryButton
 */
const TitleDeliveryButton = new TitleDeliveryButton$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UgcEpisode$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UgcEpisode", [
            { no: 1, name: "id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "aid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "cover_right_text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "page", kind: "message", T: () => Page },
            { no: 8, name: "vt", kind: "message", T: () => StatInfo },
            { no: 9, name: "danmaku", kind: "message", T: () => StatInfo }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.aid = 0;
        message.cid = 0;
        message.title = "";
        message.cover = "";
        message.coverRightText = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 id */ 1:
                    message.id = reader.int64().toNumber();
                    break;
                case /* int64 aid */ 2:
                    message.aid = reader.int64().toNumber();
                    break;
                case /* int64 cid */ 3:
                    message.cid = reader.int64().toNumber();
                    break;
                case /* string title */ 4:
                    message.title = reader.string();
                    break;
                case /* string cover */ 5:
                    message.cover = reader.string();
                    break;
                case /* string cover_right_text */ 6:
                    message.coverRightText = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Page page */ 7:
                    message.page = Page.internalBinaryRead(reader, reader.uint32(), options, message.page);
                    break;
                case /* bilibili.app.viewunite.common.StatInfo vt */ 8:
                    message.vt = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.vt);
                    break;
                case /* bilibili.app.viewunite.common.StatInfo danmaku */ 9:
                    message.danmaku = StatInfo.internalBinaryRead(reader, reader.uint32(), options, message.danmaku);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int64(message.id);
        /* int64 aid = 2; */
        if (message.aid !== 0)
            writer.tag(2, WireType.Varint).int64(message.aid);
        /* int64 cid = 3; */
        if (message.cid !== 0)
            writer.tag(3, WireType.Varint).int64(message.cid);
        /* string title = 4; */
        if (message.title !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.title);
        /* string cover = 5; */
        if (message.cover !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.cover);
        /* string cover_right_text = 6; */
        if (message.coverRightText !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.coverRightText);
        /* bilibili.app.viewunite.common.Page page = 7; */
        if (message.page)
            Page.internalBinaryWrite(message.page, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.StatInfo vt = 8; */
        if (message.vt)
            StatInfo.internalBinaryWrite(message.vt, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.StatInfo danmaku = 9; */
        if (message.danmaku)
            StatInfo.internalBinaryWrite(message.danmaku, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UgcEpisode
 */
const UgcEpisode = new UgcEpisode$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UgcIntroduction$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UgcIntroduction", [
            { no: 1, name: "tags", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Tag },
            { no: 2, name: "rating", kind: "message", T: () => Rating },
            { no: 3, name: "rank", kind: "message", T: () => Rank },
            { no: 4, name: "bgm", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ViewMaterial },
            { no: 5, name: "sticker", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ViewMaterial },
            { no: 6, name: "video_source", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ViewMaterial },
            { no: 7, name: "pubdate", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 8, name: "desc", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => DescV2 }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.tags = [];
        message.bgm = [];
        message.sticker = [];
        message.videoSource = [];
        message.pubdate = 0;
        message.desc = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.Tag tags */ 1:
                    message.tags.push(Tag.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.Rating rating */ 2:
                    message.rating = Rating.internalBinaryRead(reader, reader.uint32(), options, message.rating);
                    break;
                case /* bilibili.app.viewunite.common.Rank rank */ 3:
                    message.rank = Rank.internalBinaryRead(reader, reader.uint32(), options, message.rank);
                    break;
                case /* repeated bilibili.app.viewunite.common.ViewMaterial bgm */ 4:
                    message.bgm.push(ViewMaterial.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated bilibili.app.viewunite.common.ViewMaterial sticker */ 5:
                    message.sticker.push(ViewMaterial.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated bilibili.app.viewunite.common.ViewMaterial video_source */ 6:
                    message.videoSource.push(ViewMaterial.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* int64 pubdate */ 7:
                    message.pubdate = reader.int64().toNumber();
                    break;
                case /* repeated bilibili.app.viewunite.common.DescV2 desc */ 8:
                    message.desc.push(DescV2.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.Tag tags = 1; */
        for (let i = 0; i < message.tags.length; i++)
            Tag.internalBinaryWrite(message.tags[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Rating rating = 2; */
        if (message.rating)
            Rating.internalBinaryWrite(message.rating, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Rank rank = 3; */
        if (message.rank)
            Rank.internalBinaryWrite(message.rank, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.ViewMaterial bgm = 4; */
        for (let i = 0; i < message.bgm.length; i++)
            ViewMaterial.internalBinaryWrite(message.bgm[i], writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.ViewMaterial sticker = 5; */
        for (let i = 0; i < message.sticker.length; i++)
            ViewMaterial.internalBinaryWrite(message.sticker[i], writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* repeated bilibili.app.viewunite.common.ViewMaterial video_source = 6; */
        for (let i = 0; i < message.videoSource.length; i++)
            ViewMaterial.internalBinaryWrite(message.videoSource[i], writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* int64 pubdate = 7; */
        if (message.pubdate !== 0)
            writer.tag(7, WireType.Varint).int64(message.pubdate);
        /* repeated bilibili.app.viewunite.common.DescV2 desc = 8; */
        for (let i = 0; i < message.desc.length; i++)
            DescV2.internalBinaryWrite(message.desc[i], writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UgcIntroduction
 */
const UgcIntroduction = new UgcIntroduction$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UgcSeasonActivity$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UgcSeasonActivity", [
            { no: 1, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "oid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "activity_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "intro", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "day_count", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "user_count", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "join_deadline", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 9, name: "activity_deadline", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 10, name: "checkin_view_time", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 11, name: "new_activity", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 12, name: "user_activity", kind: "message", T: () => UserActivity },
            { no: 13, name: "season_show", kind: "message", T: () => SeasonShow }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.type = 0;
        message.oid = 0;
        message.activityId = 0;
        message.title = "";
        message.intro = "";
        message.dayCount = 0;
        message.userCount = 0;
        message.joinDeadline = 0;
        message.activityDeadline = 0;
        message.checkinViewTime = 0;
        message.newActivity = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 type */ 1:
                    message.type = reader.int32();
                    break;
                case /* int64 oid */ 2:
                    message.oid = reader.int64().toNumber();
                    break;
                case /* int64 activity_id */ 3:
                    message.activityId = reader.int64().toNumber();
                    break;
                case /* string title */ 4:
                    message.title = reader.string();
                    break;
                case /* string intro */ 5:
                    message.intro = reader.string();
                    break;
                case /* int32 day_count */ 6:
                    message.dayCount = reader.int32();
                    break;
                case /* int32 user_count */ 7:
                    message.userCount = reader.int32();
                    break;
                case /* int64 join_deadline */ 8:
                    message.joinDeadline = reader.int64().toNumber();
                    break;
                case /* int64 activity_deadline */ 9:
                    message.activityDeadline = reader.int64().toNumber();
                    break;
                case /* int32 checkin_view_time */ 10:
                    message.checkinViewTime = reader.int32();
                    break;
                case /* bool new_activity */ 11:
                    message.newActivity = reader.bool();
                    break;
                case /* bilibili.app.viewunite.common.UserActivity user_activity */ 12:
                    message.userActivity = UserActivity.internalBinaryRead(reader, reader.uint32(), options, message.userActivity);
                    break;
                case /* bilibili.app.viewunite.common.SeasonShow season_show */ 13:
                    message.seasonShow = SeasonShow.internalBinaryRead(reader, reader.uint32(), options, message.seasonShow);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 type = 1; */
        if (message.type !== 0)
            writer.tag(1, WireType.Varint).int32(message.type);
        /* int64 oid = 2; */
        if (message.oid !== 0)
            writer.tag(2, WireType.Varint).int64(message.oid);
        /* int64 activity_id = 3; */
        if (message.activityId !== 0)
            writer.tag(3, WireType.Varint).int64(message.activityId);
        /* string title = 4; */
        if (message.title !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.title);
        /* string intro = 5; */
        if (message.intro !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.intro);
        /* int32 day_count = 6; */
        if (message.dayCount !== 0)
            writer.tag(6, WireType.Varint).int32(message.dayCount);
        /* int32 user_count = 7; */
        if (message.userCount !== 0)
            writer.tag(7, WireType.Varint).int32(message.userCount);
        /* int64 join_deadline = 8; */
        if (message.joinDeadline !== 0)
            writer.tag(8, WireType.Varint).int64(message.joinDeadline);
        /* int64 activity_deadline = 9; */
        if (message.activityDeadline !== 0)
            writer.tag(9, WireType.Varint).int64(message.activityDeadline);
        /* int32 checkin_view_time = 10; */
        if (message.checkinViewTime !== 0)
            writer.tag(10, WireType.Varint).int32(message.checkinViewTime);
        /* bool new_activity = 11; */
        if (message.newActivity !== false)
            writer.tag(11, WireType.Varint).bool(message.newActivity);
        /* bilibili.app.viewunite.common.UserActivity user_activity = 12; */
        if (message.userActivity)
            UserActivity.internalBinaryWrite(message.userActivity, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.SeasonShow season_show = 13; */
        if (message.seasonShow)
            SeasonShow.internalBinaryWrite(message.seasonShow, writer.tag(13, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UgcSeasonActivity
 */
const UgcSeasonActivity = new UgcSeasonActivity$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UgcSeasons$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UgcSeasons", [
            { no: 1, name: "id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "supernatant_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "section", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => UgcSection },
            { no: 6, name: "union_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "head", kind: "message", T: () => SeasonHead },
            { no: 8, name: "ep_count", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 9, name: "season_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 10, name: "activity", kind: "message", T: () => UgcSeasonActivity },
            { no: 11, name: "season_ability", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "season_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.title = "";
        message.cover = "";
        message.supernatantTitle = "";
        message.section = [];
        message.unionTitle = "";
        message.epCount = 0;
        message.seasonType = 0;
        message.seasonAbility = [];
        message.seasonTitle = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 id */ 1:
                    message.id = reader.int64().toNumber();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* string cover */ 3:
                    message.cover = reader.string();
                    break;
                case /* string supernatant_title */ 4:
                    message.supernatantTitle = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.UgcSection section */ 5:
                    message.section.push(UgcSection.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string union_title */ 6:
                    message.unionTitle = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.SeasonHead head */ 7:
                    message.head = SeasonHead.internalBinaryRead(reader, reader.uint32(), options, message.head);
                    break;
                case /* int64 ep_count */ 8:
                    message.epCount = reader.int64().toNumber();
                    break;
                case /* int32 season_type */ 9:
                    message.seasonType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.UgcSeasonActivity activity */ 10:
                    message.activity = UgcSeasonActivity.internalBinaryRead(reader, reader.uint32(), options, message.activity);
                    break;
                case /* repeated string season_ability */ 11:
                    message.seasonAbility.push(reader.string());
                    break;
                case /* string season_title */ 12:
                    message.seasonTitle = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int64(message.id);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* string cover = 3; */
        if (message.cover !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.cover);
        /* string supernatant_title = 4; */
        if (message.supernatantTitle !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.supernatantTitle);
        /* repeated bilibili.app.viewunite.common.UgcSection section = 5; */
        for (let i = 0; i < message.section.length; i++)
            UgcSection.internalBinaryWrite(message.section[i], writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* string union_title = 6; */
        if (message.unionTitle !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.unionTitle);
        /* bilibili.app.viewunite.common.SeasonHead head = 7; */
        if (message.head)
            SeasonHead.internalBinaryWrite(message.head, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* int64 ep_count = 8; */
        if (message.epCount !== 0)
            writer.tag(8, WireType.Varint).int64(message.epCount);
        /* int32 season_type = 9; */
        if (message.seasonType !== 0)
            writer.tag(9, WireType.Varint).int32(message.seasonType);
        /* bilibili.app.viewunite.common.UgcSeasonActivity activity = 10; */
        if (message.activity)
            UgcSeasonActivity.internalBinaryWrite(message.activity, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* repeated string season_ability = 11; */
        for (let i = 0; i < message.seasonAbility.length; i++)
            writer.tag(11, WireType.LengthDelimited).string(message.seasonAbility[i]);
        /* string season_title = 12; */
        if (message.seasonTitle !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.seasonTitle);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UgcSeasons
 */
const UgcSeasons = new UgcSeasons$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UgcSection$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UgcSection", [
            { no: 1, name: "id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 4, name: "episodes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => UgcEpisode }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.id = 0;
        message.title = "";
        message.type = 0;
        message.episodes = [];
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 id */ 1:
                    message.id = reader.int64().toNumber();
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* int64 type */ 3:
                    message.type = reader.int64().toNumber();
                    break;
                case /* repeated bilibili.app.viewunite.common.UgcEpisode episodes */ 4:
                    message.episodes.push(UgcEpisode.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int64(message.id);
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* int64 type = 3; */
        if (message.type !== 0)
            writer.tag(3, WireType.Varint).int64(message.type);
        /* repeated bilibili.app.viewunite.common.UgcEpisode episodes = 4; */
        for (let i = 0; i < message.episodes.length; i++)
            UgcEpisode.internalBinaryWrite(message.episodes[i], writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UgcSection
 */
const UgcSection = new UgcSection$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpLikeImg$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UpLikeImg", [
            { no: 1, name: "pre_img", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "suc_img", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "type", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.preImg = "";
        message.sucImg = "";
        message.content = "";
        message.type = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string pre_img */ 1:
                    message.preImg = reader.string();
                    break;
                case /* string suc_img */ 2:
                    message.sucImg = reader.string();
                    break;
                case /* string content */ 3:
                    message.content = reader.string();
                    break;
                case /* int64 type */ 4:
                    message.type = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string pre_img = 1; */
        if (message.preImg !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.preImg);
        /* string suc_img = 2; */
        if (message.sucImg !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.sucImg);
        /* string content = 3; */
        if (message.content !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.content);
        /* int64 type = 4; */
        if (message.type !== 0)
            writer.tag(4, WireType.Varint).int64(message.type);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UpLikeImg
 */
const UpLikeImg = new UpLikeImg$Type();
// @generated message type with reflection information, may provide speed optimized methods
class User$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.User", [
            { no: 1, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "face", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "follower", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.mid = 0;
        message.name = "";
        message.face = "";
        message.follower = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 mid */ 1:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string face */ 3:
                    message.face = reader.string();
                    break;
                case /* int64 follower */ 4:
                    message.follower = reader.int64().toNumber();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 mid = 1; */
        if (message.mid !== 0)
            writer.tag(1, WireType.Varint).int64(message.mid);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* string face = 3; */
        if (message.face !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.face);
        /* int64 follower = 4; */
        if (message.follower !== 0)
            writer.tag(4, WireType.Varint).int64(message.follower);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.User
 */
const User = new User$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UserActivity$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UserActivity", [
            { no: 1, name: "user_state", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "last_checkin_date", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "checkin_today", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "user_day_count", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "user_view_time", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "portrait", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.userState = 0;
        message.lastCheckinDate = 0;
        message.checkinToday = 0;
        message.userDayCount = 0;
        message.userViewTime = 0;
        message.portrait = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 user_state */ 1:
                    message.userState = reader.int32();
                    break;
                case /* int64 last_checkin_date */ 2:
                    message.lastCheckinDate = reader.int64().toNumber();
                    break;
                case /* int32 checkin_today */ 3:
                    message.checkinToday = reader.int32();
                    break;
                case /* int32 user_day_count */ 4:
                    message.userDayCount = reader.int32();
                    break;
                case /* int32 user_view_time */ 5:
                    message.userViewTime = reader.int32();
                    break;
                case /* string portrait */ 6:
                    message.portrait = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 user_state = 1; */
        if (message.userState !== 0)
            writer.tag(1, WireType.Varint).int32(message.userState);
        /* int64 last_checkin_date = 2; */
        if (message.lastCheckinDate !== 0)
            writer.tag(2, WireType.Varint).int64(message.lastCheckinDate);
        /* int32 checkin_today = 3; */
        if (message.checkinToday !== 0)
            writer.tag(3, WireType.Varint).int32(message.checkinToday);
        /* int32 user_day_count = 4; */
        if (message.userDayCount !== 0)
            writer.tag(4, WireType.Varint).int32(message.userDayCount);
        /* int32 user_view_time = 5; */
        if (message.userViewTime !== 0)
            writer.tag(5, WireType.Varint).int32(message.userViewTime);
        /* string portrait = 6; */
        if (message.portrait !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.portrait);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UserActivity
 */
const UserActivity = new UserActivity$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UserList$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UserList", [
            { no: 1, name: "list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => User },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.list = [];
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.common.User list */ 1:
                    message.list.push(User.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.common.User list = 1; */
        for (let i = 0; i < message.list.length; i++)
            User.internalBinaryWrite(message.list[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UserList
 */
const UserList = new UserList$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UserStatus$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.UserStatus", [
            { no: 1, name: "show", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "follow", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.show = 0;
        message.follow = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 show */ 1:
                    message.show = reader.int32();
                    break;
                case /* int32 follow */ 2:
                    message.follow = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 show = 1; */
        if (message.show !== 0)
            writer.tag(1, WireType.Varint).int32(message.show);
        /* int32 follow = 2; */
        if (message.follow !== 0)
            writer.tag(2, WireType.Varint).int32(message.follow);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.UserStatus
 */
new UserStatus$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ViewEpisode$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ViewEpisode", [
            { no: 1, name: "ep_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "badge", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "badge_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "badge_info", kind: "message", T: () => BadgeInfo },
            { no: 5, name: "duration", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "status", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "aid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 9, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "movie_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "subtitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "long_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 13, name: "toast_title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 14, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 15, name: "from", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 16, name: "share_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 17, name: "share_copy", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 18, name: "short_link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 19, name: "vid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 20, name: "release_date", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 21, name: "dimension", kind: "message", T: () => Dimension },
            { no: 22, name: "rights", kind: "message", T: () => Rights$1 },
            { no: 23, name: "interaction", kind: "message", T: () => Interaction },
            { no: 24, name: "bvid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 25, name: "archive_attr", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 26, name: "link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 27, name: "link_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 28, name: "bmid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 29, name: "pub_time", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 30, name: "pv", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 31, name: "ep_index", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 32, name: "section_index", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 33, name: "up_infos", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Staff },
            { no: 34, name: "up_info", kind: "message", T: () => Staff },
            { no: 35, name: "dialog_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 36, name: "toast_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 37, name: "multi_view_eps", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => MultiViewEp },
            { no: 38, name: "is_sub_view", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 39, name: "is_view_hide", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 40, name: "jump_link", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 41, name: "stat_for_unity", kind: "message", T: () => Stat },
            { no: 42, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.epId = 0;
        message.badge = "";
        message.badgeType = 0;
        message.duration = 0;
        message.status = 0;
        message.cover = "";
        message.aid = 0;
        message.title = "";
        message.movieTitle = "";
        message.subtitle = "";
        message.longTitle = "";
        message.toastTitle = "";
        message.cid = 0;
        message.from = "";
        message.shareUrl = "";
        message.shareCopy = "";
        message.shortLink = "";
        message.vid = "";
        message.releaseDate = "";
        message.bvid = "";
        message.archiveAttr = 0;
        message.link = "";
        message.linkType = "";
        message.bmid = "";
        message.pubTime = 0;
        message.pv = 0;
        message.epIndex = 0;
        message.sectionIndex = 0;
        message.upInfos = [];
        message.dialogType = "";
        message.toastType = "";
        message.multiViewEps = [];
        message.isSubView = false;
        message.isViewHide = false;
        message.jumpLink = "";
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 ep_id */ 1:
                    message.epId = reader.int64().toNumber();
                    break;
                case /* string badge */ 2:
                    message.badge = reader.string();
                    break;
                case /* int32 badge_type */ 3:
                    message.badgeType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.BadgeInfo badge_info */ 4:
                    message.badgeInfo = BadgeInfo.internalBinaryRead(reader, reader.uint32(), options, message.badgeInfo);
                    break;
                case /* int32 duration */ 5:
                    message.duration = reader.int32();
                    break;
                case /* int32 status */ 6:
                    message.status = reader.int32();
                    break;
                case /* string cover */ 7:
                    message.cover = reader.string();
                    break;
                case /* int64 aid */ 8:
                    message.aid = reader.int64().toNumber();
                    break;
                case /* string title */ 9:
                    message.title = reader.string();
                    break;
                case /* string movie_title */ 10:
                    message.movieTitle = reader.string();
                    break;
                case /* string subtitle */ 11:
                    message.subtitle = reader.string();
                    break;
                case /* string long_title */ 12:
                    message.longTitle = reader.string();
                    break;
                case /* string toast_title */ 13:
                    message.toastTitle = reader.string();
                    break;
                case /* int64 cid */ 14:
                    message.cid = reader.int64().toNumber();
                    break;
                case /* string from */ 15:
                    message.from = reader.string();
                    break;
                case /* string share_url */ 16:
                    message.shareUrl = reader.string();
                    break;
                case /* string share_copy */ 17:
                    message.shareCopy = reader.string();
                    break;
                case /* string short_link */ 18:
                    message.shortLink = reader.string();
                    break;
                case /* string vid */ 19:
                    message.vid = reader.string();
                    break;
                case /* string release_date */ 20:
                    message.releaseDate = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Dimension dimension */ 21:
                    message.dimension = Dimension.internalBinaryRead(reader, reader.uint32(), options, message.dimension);
                    break;
                case /* bilibili.app.viewunite.common.Rights rights */ 22:
                    message.rights = Rights$1.internalBinaryRead(reader, reader.uint32(), options, message.rights);
                    break;
                case /* bilibili.app.viewunite.common.Interaction interaction */ 23:
                    message.interaction = Interaction.internalBinaryRead(reader, reader.uint32(), options, message.interaction);
                    break;
                case /* string bvid */ 24:
                    message.bvid = reader.string();
                    break;
                case /* int32 archive_attr */ 25:
                    message.archiveAttr = reader.int32();
                    break;
                case /* string link */ 26:
                    message.link = reader.string();
                    break;
                case /* string link_type */ 27:
                    message.linkType = reader.string();
                    break;
                case /* string bmid */ 28:
                    message.bmid = reader.string();
                    break;
                case /* int64 pub_time */ 29:
                    message.pubTime = reader.int64().toNumber();
                    break;
                case /* int32 pv */ 30:
                    message.pv = reader.int32();
                    break;
                case /* int32 ep_index */ 31:
                    message.epIndex = reader.int32();
                    break;
                case /* int32 section_index */ 32:
                    message.sectionIndex = reader.int32();
                    break;
                case /* repeated bilibili.app.viewunite.common.Staff up_infos */ 33:
                    message.upInfos.push(Staff.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bilibili.app.viewunite.common.Staff up_info */ 34:
                    message.upInfo = Staff.internalBinaryRead(reader, reader.uint32(), options, message.upInfo);
                    break;
                case /* string dialog_type */ 35:
                    message.dialogType = reader.string();
                    break;
                case /* string toast_type */ 36:
                    message.toastType = reader.string();
                    break;
                case /* repeated bilibili.app.viewunite.common.MultiViewEp multi_view_eps */ 37:
                    message.multiViewEps.push(MultiViewEp.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bool is_sub_view */ 38:
                    message.isSubView = reader.bool();
                    break;
                case /* bool is_view_hide */ 39:
                    message.isViewHide = reader.bool();
                    break;
                case /* string jump_link */ 40:
                    message.jumpLink = reader.string();
                    break;
                case /* bilibili.app.viewunite.common.Stat stat_for_unity */ 41:
                    message.statForUnity = Stat.internalBinaryRead(reader, reader.uint32(), options, message.statForUnity);
                    break;
                case /* map<string, string> report */ 42:
                    this.binaryReadMap42(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap42(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.common.ViewEpisode.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 ep_id = 1; */
        if (message.epId !== 0)
            writer.tag(1, WireType.Varint).int64(message.epId);
        /* string badge = 2; */
        if (message.badge !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.badge);
        /* int32 badge_type = 3; */
        if (message.badgeType !== 0)
            writer.tag(3, WireType.Varint).int32(message.badgeType);
        /* bilibili.app.viewunite.common.BadgeInfo badge_info = 4; */
        if (message.badgeInfo)
            BadgeInfo.internalBinaryWrite(message.badgeInfo, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* int32 duration = 5; */
        if (message.duration !== 0)
            writer.tag(5, WireType.Varint).int32(message.duration);
        /* int32 status = 6; */
        if (message.status !== 0)
            writer.tag(6, WireType.Varint).int32(message.status);
        /* string cover = 7; */
        if (message.cover !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.cover);
        /* int64 aid = 8; */
        if (message.aid !== 0)
            writer.tag(8, WireType.Varint).int64(message.aid);
        /* string title = 9; */
        if (message.title !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.title);
        /* string movie_title = 10; */
        if (message.movieTitle !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.movieTitle);
        /* string subtitle = 11; */
        if (message.subtitle !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.subtitle);
        /* string long_title = 12; */
        if (message.longTitle !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.longTitle);
        /* string toast_title = 13; */
        if (message.toastTitle !== "")
            writer.tag(13, WireType.LengthDelimited).string(message.toastTitle);
        /* int64 cid = 14; */
        if (message.cid !== 0)
            writer.tag(14, WireType.Varint).int64(message.cid);
        /* string from = 15; */
        if (message.from !== "")
            writer.tag(15, WireType.LengthDelimited).string(message.from);
        /* string share_url = 16; */
        if (message.shareUrl !== "")
            writer.tag(16, WireType.LengthDelimited).string(message.shareUrl);
        /* string share_copy = 17; */
        if (message.shareCopy !== "")
            writer.tag(17, WireType.LengthDelimited).string(message.shareCopy);
        /* string short_link = 18; */
        if (message.shortLink !== "")
            writer.tag(18, WireType.LengthDelimited).string(message.shortLink);
        /* string vid = 19; */
        if (message.vid !== "")
            writer.tag(19, WireType.LengthDelimited).string(message.vid);
        /* string release_date = 20; */
        if (message.releaseDate !== "")
            writer.tag(20, WireType.LengthDelimited).string(message.releaseDate);
        /* bilibili.app.viewunite.common.Dimension dimension = 21; */
        if (message.dimension)
            Dimension.internalBinaryWrite(message.dimension, writer.tag(21, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Rights rights = 22; */
        if (message.rights)
            Rights$1.internalBinaryWrite(message.rights, writer.tag(22, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Interaction interaction = 23; */
        if (message.interaction)
            Interaction.internalBinaryWrite(message.interaction, writer.tag(23, WireType.LengthDelimited).fork(), options).join();
        /* string bvid = 24; */
        if (message.bvid !== "")
            writer.tag(24, WireType.LengthDelimited).string(message.bvid);
        /* int32 archive_attr = 25; */
        if (message.archiveAttr !== 0)
            writer.tag(25, WireType.Varint).int32(message.archiveAttr);
        /* string link = 26; */
        if (message.link !== "")
            writer.tag(26, WireType.LengthDelimited).string(message.link);
        /* string link_type = 27; */
        if (message.linkType !== "")
            writer.tag(27, WireType.LengthDelimited).string(message.linkType);
        /* string bmid = 28; */
        if (message.bmid !== "")
            writer.tag(28, WireType.LengthDelimited).string(message.bmid);
        /* int64 pub_time = 29; */
        if (message.pubTime !== 0)
            writer.tag(29, WireType.Varint).int64(message.pubTime);
        /* int32 pv = 30; */
        if (message.pv !== 0)
            writer.tag(30, WireType.Varint).int32(message.pv);
        /* int32 ep_index = 31; */
        if (message.epIndex !== 0)
            writer.tag(31, WireType.Varint).int32(message.epIndex);
        /* int32 section_index = 32; */
        if (message.sectionIndex !== 0)
            writer.tag(32, WireType.Varint).int32(message.sectionIndex);
        /* repeated bilibili.app.viewunite.common.Staff up_infos = 33; */
        for (let i = 0; i < message.upInfos.length; i++)
            Staff.internalBinaryWrite(message.upInfos[i], writer.tag(33, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Staff up_info = 34; */
        if (message.upInfo)
            Staff.internalBinaryWrite(message.upInfo, writer.tag(34, WireType.LengthDelimited).fork(), options).join();
        /* string dialog_type = 35; */
        if (message.dialogType !== "")
            writer.tag(35, WireType.LengthDelimited).string(message.dialogType);
        /* string toast_type = 36; */
        if (message.toastType !== "")
            writer.tag(36, WireType.LengthDelimited).string(message.toastType);
        /* repeated bilibili.app.viewunite.common.MultiViewEp multi_view_eps = 37; */
        for (let i = 0; i < message.multiViewEps.length; i++)
            MultiViewEp.internalBinaryWrite(message.multiViewEps[i], writer.tag(37, WireType.LengthDelimited).fork(), options).join();
        /* bool is_sub_view = 38; */
        if (message.isSubView !== false)
            writer.tag(38, WireType.Varint).bool(message.isSubView);
        /* bool is_view_hide = 39; */
        if (message.isViewHide !== false)
            writer.tag(39, WireType.Varint).bool(message.isViewHide);
        /* string jump_link = 40; */
        if (message.jumpLink !== "")
            writer.tag(40, WireType.LengthDelimited).string(message.jumpLink);
        /* bilibili.app.viewunite.common.Stat stat_for_unity = 41; */
        if (message.statForUnity)
            Stat.internalBinaryWrite(message.statForUnity, writer.tag(41, WireType.LengthDelimited).fork(), options).join();
        /* map<string, string> report = 42; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(42, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ViewEpisode
 */
const ViewEpisode = new ViewEpisode$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ViewMaterial$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.ViewMaterial", [
            { no: 1, name: "oid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "author", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "jump_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.oid = 0;
        message.mid = 0;
        message.title = "";
        message.author = "";
        message.jumpUrl = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 oid */ 1:
                    message.oid = reader.int64().toNumber();
                    break;
                case /* int64 mid */ 2:
                    message.mid = reader.int64().toNumber();
                    break;
                case /* string title */ 3:
                    message.title = reader.string();
                    break;
                case /* string author */ 4:
                    message.author = reader.string();
                    break;
                case /* string jump_url */ 5:
                    message.jumpUrl = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 oid = 1; */
        if (message.oid !== 0)
            writer.tag(1, WireType.Varint).int64(message.oid);
        /* int64 mid = 2; */
        if (message.mid !== 0)
            writer.tag(2, WireType.Varint).int64(message.mid);
        /* string title = 3; */
        if (message.title !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.title);
        /* string author = 4; */
        if (message.author !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.author);
        /* string jump_url = 5; */
        if (message.jumpUrl !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.jumpUrl);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.ViewMaterial
 */
const ViewMaterial = new ViewMaterial$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Vip$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.Vip", [
            { no: 1, name: "type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "vip_status", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "theme_type", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "label", kind: "message", T: () => VipLabel },
            { no: 5, name: "is_vip", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.type = 0;
        message.vipStatus = 0;
        message.themeType = 0;
        message.isVip = 0;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 type */ 1:
                    message.type = reader.int32();
                    break;
                case /* int32 vip_status */ 2:
                    message.vipStatus = reader.int32();
                    break;
                case /* int32 theme_type */ 3:
                    message.themeType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.common.VipLabel label */ 4:
                    message.label = VipLabel.internalBinaryRead(reader, reader.uint32(), options, message.label);
                    break;
                case /* int32 is_vip */ 5:
                    message.isVip = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int32 type = 1; */
        if (message.type !== 0)
            writer.tag(1, WireType.Varint).int32(message.type);
        /* int32 vip_status = 2; */
        if (message.vipStatus !== 0)
            writer.tag(2, WireType.Varint).int32(message.vipStatus);
        /* int32 theme_type = 3; */
        if (message.themeType !== 0)
            writer.tag(3, WireType.Varint).int32(message.themeType);
        /* bilibili.app.viewunite.common.VipLabel label = 4; */
        if (message.label)
            VipLabel.internalBinaryWrite(message.label, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* int32 is_vip = 5; */
        if (message.isVip !== 0)
            writer.tag(5, WireType.Varint).int32(message.isVip);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Vip
 */
const Vip = new Vip$Type();
// @generated message type with reflection information, may provide speed optimized methods
class VipLabel$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.VipLabel", [
            { no: 1, name: "path", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "label_theme", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.path = "";
        message.text = "";
        message.labelTheme = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string path */ 1:
                    message.path = reader.string();
                    break;
                case /* string text */ 2:
                    message.text = reader.string();
                    break;
                case /* string label_theme */ 3:
                    message.labelTheme = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string path = 1; */
        if (message.path !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.path);
        /* string text = 2; */
        if (message.text !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.text);
        /* string label_theme = 3; */
        if (message.labelTheme !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.labelTheme);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.VipLabel
 */
const VipLabel = new VipLabel$Type();
// @generated message type with reflection information, may provide speed optimized methods
class WikiInfo$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.common.WikiInfo", [
            { no: 1, name: "wiki_label", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "wiki_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.wikiLabel = "";
        message.wikiUrl = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string wiki_label */ 1:
                    message.wikiLabel = reader.string();
                    break;
                case /* string wiki_url */ 2:
                    message.wikiUrl = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string wiki_label = 1; */
        if (message.wikiLabel !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.wikiLabel);
        /* string wiki_url = 2; */
        if (message.wikiUrl !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.wikiUrl);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.common.WikiInfo
 */
const WikiInfo = new WikiInfo$Type();

// @generated by protobuf-ts 2.9.4 with parameter generate_dependencies,long_type_number,output_javascript
// @generated from protobuf file "bilibili/app/viewunite/v1/viewunite.proto" (package "bilibili.app.viewunite.v1", syntax proto3)
// tslint:disable
// @generated by protobuf-ts 2.9.4 with parameter generate_dependencies,long_type_number,output_javascript
// @generated from protobuf file "bilibili/app/viewunite/v1/viewunite.proto" (package "bilibili.app.viewunite.v1", syntax proto3)
// tslint:disable
/**
 * @generated from protobuf enum bilibili.app.viewunite.v1.TabType
 */
var TabType;
(function (TabType) {
    /**
     *
     *
     * @generated from protobuf enum value: TAB_NONE = 0;
     */
    TabType[TabType["TAB_NONE"] = 0] = "TAB_NONE";
    /**
     * 详情 Tab
     *
     * @generated from protobuf enum value: TAB_INTRODUCTION = 1;
     */
    TabType[TabType["TAB_INTRODUCTION"] = 1] = "TAB_INTRODUCTION";
    /**
     * 评论区 Tab
     *
     * @generated from protobuf enum value: TAB_REPLY = 2;
     */
    TabType[TabType["TAB_REPLY"] = 2] = "TAB_REPLY";
    /**
     * OGV 活动信息 Tab
     *
     * @generated from protobuf enum value: TAB_OGV_ACTIVITY = 3;
     */
    TabType[TabType["TAB_OGV_ACTIVITY"] = 3] = "TAB_OGV_ACTIVITY";
})(TabType || (TabType = {}));
// @generated message type with reflection information, may provide speed optimized methods
class Arc$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.Arc", [
            { no: 1, name: "aid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 3, name: "duration", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 5, name: "bvid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "copyright", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "right", kind: "message", T: () => Rights },
            { no: 8, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "type_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 10, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.aid = 0;
        message.cid = 0;
        message.duration = 0;
        message.bvid = "";
        message.copyright = 0;
        message.cover = "";
        message.typeId = 0;
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 aid = 1 [jstype = JS_NUMBER];*/ 1:
                    message.aid = reader.int64().toNumber();
                    break;
                case /* int64 cid = 2 [jstype = JS_NUMBER];*/ 2:
                    message.cid = reader.int64().toNumber();
                    break;
                case /* int64 duration = 3 [jstype = JS_NUMBER];*/ 3:
                    message.duration = reader.int64().toNumber();
                    break;
                case /* string bvid */ 5:
                    message.bvid = reader.string();
                    break;
                case /* int32 copyright */ 6:
                    message.copyright = reader.int32();
                    break;
                case /* bilibili.app.viewunite.v1.Rights right */ 7:
                    message.right = Rights.internalBinaryRead(reader, reader.uint32(), options, message.right);
                    break;
                case /* string cover */ 8:
                    message.cover = reader.string();
                    break;
                case /* int64 type_id = 9 [jstype = JS_NUMBER];*/ 9:
                    message.typeId = reader.int64().toNumber();
                    break;
                case /* string title */ 10:
                    message.title = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* int64 aid = 1 [jstype = JS_NUMBER]; */
        if (message.aid !== 0)
            writer.tag(1, WireType.Varint).int64(message.aid);
        /* int64 cid = 2 [jstype = JS_NUMBER]; */
        if (message.cid !== 0)
            writer.tag(2, WireType.Varint).int64(message.cid);
        /* int64 duration = 3 [jstype = JS_NUMBER]; */
        if (message.duration !== 0)
            writer.tag(3, WireType.Varint).int64(message.duration);
        /* string bvid = 5; */
        if (message.bvid !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.bvid);
        /* int32 copyright = 6; */
        if (message.copyright !== 0)
            writer.tag(6, WireType.Varint).int32(message.copyright);
        /* bilibili.app.viewunite.v1.Rights right = 7; */
        if (message.right)
            Rights.internalBinaryWrite(message.right, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* string cover = 8; */
        if (message.cover !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.cover);
        /* int64 type_id = 9 [jstype = JS_NUMBER]; */
        if (message.typeId !== 0)
            writer.tag(9, WireType.Varint).int64(message.typeId);
        /* string title = 10; */
        if (message.title !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.title);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.Arc
 */
const Arc = new Arc$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IntroductionTab$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.IntroductionTab", [
            { no: 1, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 1:
                    message.title = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 1; */
        if (message.title !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.title);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.IntroductionTab
 */
const IntroductionTab = new IntroductionTab$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReplyTab$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.ReplyTab", [
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "control", kind: "message", T: () => TabControl }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.title = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string title */ 2:
                    message.title = reader.string();
                    break;
                case /* bilibili.app.viewunite.v1.TabControl control */ 3:
                    message.control = TabControl.internalBinaryRead(reader, reader.uint32(), options, message.control);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string title = 2; */
        if (message.title !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.title);
        /* bilibili.app.viewunite.v1.TabControl control = 3; */
        if (message.control)
            TabControl.internalBinaryWrite(message.control, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.ReplyTab
 */
const ReplyTab = new ReplyTab$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Rights$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.Rights", [
            { no: 1, name: "only_vip_download", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "no_reprint", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "download", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.onlyVipDownload = false;
        message.noReprint = false;
        message.download = false;
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool only_vip_download */ 1:
                    message.onlyVipDownload = reader.bool();
                    break;
                case /* bool no_reprint */ 2:
                    message.noReprint = reader.bool();
                    break;
                case /* bool download */ 3:
                    message.download = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bool only_vip_download = 1; */
        if (message.onlyVipDownload !== false)
            writer.tag(1, WireType.Varint).bool(message.onlyVipDownload);
        /* bool no_reprint = 2; */
        if (message.noReprint !== false)
            writer.tag(2, WireType.Varint).bool(message.noReprint);
        /* bool download = 3; */
        if (message.download !== false)
            writer.tag(3, WireType.Varint).bool(message.download);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.Rights
 */
const Rights = new Rights$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Tab$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.Tab", [
            { no: 1, name: "tab_module", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => TabModule },
            { no: 2, name: "tab_bg", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.tabModule = [];
        message.tabBg = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated bilibili.app.viewunite.v1.TabModule tab_module */ 1:
                    message.tabModule.push(TabModule.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* string tab_bg */ 2:
                    message.tabBg = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated bilibili.app.viewunite.v1.TabModule tab_module = 1; */
        for (let i = 0; i < message.tabModule.length; i++)
            TabModule.internalBinaryWrite(message.tabModule[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string tab_bg = 2; */
        if (message.tabBg !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.tabBg);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.Tab
 */
const Tab = new Tab$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TabControl$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.TabControl", [
            { no: 1, name: "limit", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "disable", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "disable_click_tip", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.limit = false;
        message.disable = false;
        message.disableClickTip = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool limit */ 1:
                    message.limit = reader.bool();
                    break;
                case /* bool disable */ 2:
                    message.disable = reader.bool();
                    break;
                case /* string disable_click_tip */ 3:
                    message.disableClickTip = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bool limit = 1; */
        if (message.limit !== false)
            writer.tag(1, WireType.Varint).bool(message.limit);
        /* bool disable = 2; */
        if (message.disable !== false)
            writer.tag(2, WireType.Varint).bool(message.disable);
        /* string disable_click_tip = 3; */
        if (message.disableClickTip !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.disableClickTip);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.TabControl
 */
const TabControl = new TabControl$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TabModule$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.TabModule", [
            { no: 1, name: "tab_type", kind: "enum", T: () => ["bilibili.app.viewunite.v1.TabType", TabType] },
            { no: 2, name: "introduction", kind: "message", oneof: "tab", T: () => IntroductionTab },
            { no: 3, name: "reply", kind: "message", oneof: "tab", T: () => ReplyTab }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.tabType = 0;
        message.tab = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.v1.TabType tab_type */ 1:
                    message.tabType = reader.int32();
                    break;
                case /* bilibili.app.viewunite.v1.IntroductionTab introduction */ 2:
                    message.tab = {
                        oneofKind: "introduction",
                        introduction: IntroductionTab.internalBinaryRead(reader, reader.uint32(), options, message.tab.introduction)
                    };
                    break;
                case /* bilibili.app.viewunite.v1.ReplyTab reply */ 3:
                    message.tab = {
                        oneofKind: "reply",
                        reply: ReplyTab.internalBinaryRead(reader, reader.uint32(), options, message.tab.reply)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.v1.TabType tab_type = 1; */
        if (message.tabType !== 0)
            writer.tag(1, WireType.Varint).int32(message.tabType);
        /* bilibili.app.viewunite.v1.IntroductionTab introduction = 2; */
        if (message.tab.oneofKind === "introduction")
            IntroductionTab.internalBinaryWrite(message.tab.introduction, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.v1.ReplyTab reply = 3; */
        if (message.tab.oneofKind === "reply")
            ReplyTab.internalBinaryWrite(message.tab.reply, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.TabModule
 */
const TabModule = new TabModule$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ViewReply$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.ViewReply", [
            { no: 2, name: "arc", kind: "message", T: () => Arc },
            { no: 4, name: "owner", kind: "message", T: () => Owner },
            { no: 5, name: "tab", kind: "message", T: () => Tab },
            { no: 6, name: "supplement", kind: "message", T: () => Any },
            { no: 10, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.report = {};
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bilibili.app.viewunite.v1.Arc arc */ 2:
                    message.arc = Arc.internalBinaryRead(reader, reader.uint32(), options, message.arc);
                    break;
                case /* bilibili.app.viewunite.common.Owner owner */ 4:
                    message.owner = Owner.internalBinaryRead(reader, reader.uint32(), options, message.owner);
                    break;
                case /* bilibili.app.viewunite.v1.Tab tab */ 5:
                    message.tab = Tab.internalBinaryRead(reader, reader.uint32(), options, message.tab);
                    break;
                case /* google.protobuf.Any supplement */ 6:
                    message.supplement = Any.internalBinaryRead(reader, reader.uint32(), options, message.supplement);
                    break;
                case /* map<string, string> report */ 10:
                    this.binaryReadMap10(message.report, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap10(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.v1.ViewReply.report");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* bilibili.app.viewunite.v1.Arc arc = 2; */
        if (message.arc)
            Arc.internalBinaryWrite(message.arc, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.common.Owner owner = 4; */
        if (message.owner)
            Owner.internalBinaryWrite(message.owner, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* bilibili.app.viewunite.v1.Tab tab = 5; */
        if (message.tab)
            Tab.internalBinaryWrite(message.tab, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Any supplement = 6; */
        if (message.supplement)
            Any.internalBinaryWrite(message.supplement, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* map<string, string> report = 10; */
        for (let k of globalThis.Object.keys(message.report))
            writer.tag(10, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.report[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.ViewReply
 */
const ViewReply = new ViewReply$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ViewReq$Type extends MessageType {
    constructor() {
        super("bilibili.app.viewunite.v1.ViewReq", [
            { no: 1, name: "aid", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 2, name: "bvid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "from", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "spmid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "from_spmid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "session_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "track_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "extra_content", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 10, name: "play_mode", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "biz_extra", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 13, name: "ad_extra", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.aid = 0;
        message.bvid = "";
        message.from = "";
        message.spmid = "";
        message.fromSpmid = "";
        message.sessionId = "";
        message.trackId = "";
        message.extraContent = {};
        message.playMode = "";
        message.bizExtra = "";
        message.adExtra = "";
        if (value !== undefined)
            reflectionMergePartial(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* uint64 aid = 1 [jstype = JS_NUMBER];*/ 1:
                    message.aid = reader.uint64().toNumber();
                    break;
                case /* string bvid */ 2:
                    message.bvid = reader.string();
                    break;
                case /* string from */ 3:
                    message.from = reader.string();
                    break;
                case /* string spmid */ 4:
                    message.spmid = reader.string();
                    break;
                case /* string from_spmid */ 5:
                    message.fromSpmid = reader.string();
                    break;
                case /* string session_id */ 6:
                    message.sessionId = reader.string();
                    break;
                case /* string track_id */ 8:
                    message.trackId = reader.string();
                    break;
                case /* map<string, string> extra_content */ 9:
                    this.binaryReadMap9(message.extraContent, reader, options);
                    break;
                case /* string play_mode */ 10:
                    message.playMode = reader.string();
                    break;
                case /* string biz_extra */ 12:
                    message.bizExtra = reader.string();
                    break;
                case /* string ad_extra */ 13:
                    message.adExtra = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    binaryReadMap9(map, reader, options) {
        let len = reader.uint32(), end = reader.pos + len, key, val;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field bilibili.app.viewunite.v1.ViewReq.extra_content");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    internalBinaryWrite(message, writer, options) {
        /* uint64 aid = 1 [jstype = JS_NUMBER]; */
        if (message.aid !== 0)
            writer.tag(1, WireType.Varint).uint64(message.aid);
        /* string bvid = 2; */
        if (message.bvid !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.bvid);
        /* string from = 3; */
        if (message.from !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.from);
        /* string spmid = 4; */
        if (message.spmid !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.spmid);
        /* string from_spmid = 5; */
        if (message.fromSpmid !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.fromSpmid);
        /* string session_id = 6; */
        if (message.sessionId !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.sessionId);
        /* string track_id = 8; */
        if (message.trackId !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.trackId);
        /* map<string, string> extra_content = 9; */
        for (let k of globalThis.Object.keys(message.extraContent))
            writer.tag(9, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.extraContent[k]).join();
        /* string play_mode = 10; */
        if (message.playMode !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.playMode);
        /* string biz_extra = 12; */
        if (message.bizExtra !== "")
            writer.tag(12, WireType.LengthDelimited).string(message.bizExtra);
        /* string ad_extra = 13; */
        if (message.adExtra !== "")
            writer.tag(13, WireType.LengthDelimited).string(message.adExtra);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.ViewReq
 */
const ViewReq = new ViewReq$Type();
/**
 * @generated ServiceType for protobuf service bilibili.app.viewunite.v1.View
 */
new ServiceType("bilibili.app.viewunite.v1.View", [
    { name: "View", options: {}, I: ViewReq, O: ViewReply }
]);

log("v0.6.1(1008)");
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
log(`⚠ url: ${url.toJSON()}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = url.hostname, PATH = url.pathname, PATHs = url.pathname.split("/").filter(Boolean);
log(`⚠ METHOD: ${METHOD}, HOST: ${HOST}, PATH: ${PATH}` , "");
// 解析格式
const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
log(`⚠ FORMAT: ${FORMAT}`, "");
!(async () => {
	// 读取设置
	const { Settings, Caches, Configs } = setENV("BiliBili", "Global", Database$1);
	log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			// 创建空数据
			let body = { "code": 0, "message": "0", "data": {} };
			// 信息组
			let infoGroup = {
				"seasonTitle": url.searchParams.get("season_title"),
				"seasonId": parseInt(url.searchParams.get("season_id"), 10) || undefined,
				"epId": parseInt(url.searchParams.get("ep_id"), 10) || undefined,
				"mId": parseInt(url.searchParams.get("mid") || url.searchParams.get("vmid"), 10) || undefined,
				"evaluate": undefined,
				"keyword": url.searchParams.get("keyword"),
				"locale": url.searchParams.get("locale"),
				"locales": [],
				"type": "UGC"
			};
			// 格式判断
			switch (FORMAT) {
				case undefined: // 视为无body
					break;
				case "application/x-www-form-urlencoded":
				case "text/plain":
				default:
					break;
				case "application/x-mpegURL":
				case "application/x-mpegurl":
				case "application/vnd.apple.mpegurl":
				case "audio/mpegurl":
					//body = M3U8.parse($response.body);
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$response.body = M3U8.stringify(body);
					break;
				case "text/xml":
				case "text/html":
				case "text/plist":
				case "application/xml":
				case "application/plist":
				case "application/x-plist":
					//body = XML.parse($response.body);
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$response.body = XML.stringify(body);
					break;
				case "text/vtt":
				case "application/vtt":
					//body = VTT.parse($response.body);
					//log(`🚧 body: ${JSON.stringify(body)}`, "");
					//$response.body = VTT.stringify(body);
					break;
				case "text/json":
				case "application/json":
					body = JSON.parse($response.body ?? "{}");
					// 解析链接
					switch (HOST) {
						case "www.bilibili.com":
							break;
						case "app.bilibili.com":
						case "app.biliapi.net":
							break;
						case "api.bilibili.com":
						case "api.biliapi.net":
							switch (PATH) {
								case "/pgc/player/api/playurl": // 番剧-播放地址-api
								case "/pgc/player/web/playurl": // 番剧-播放地址-web
								case "/pgc/player/web/playurl/html5": // 番剧-播放地址-web-HTML5
									infoGroup.type = "PGC";
									break;
								case "/pgc/page/bangumi": // 追番页
								case "/pgc/page/cinema/tab": // 观影页
									infoGroup.type = "PGC";
									break;
								case "/x/player/wbi/playurl": // UGC-用户生产内容-播放地址
									break;
								case "/x/space/acc/info": // 用户空间-账号信息-pc
								case "/x/space/wbi/acc/info": // 用户空间-账号信息-wbi
									switch (infoGroup.mId) {
																			}									break;
								case "/pgc/view/v2/app/season": // 番剧页面-内容-app
									let data = body.data;
									infoGroup.seasonTitle = data?.season_title ?? infoGroup.seasonTitle;
									infoGroup.seasonId = data?.season_id ?? infoGroup.seasonId;
									infoGroup.mId = data?.up_info?.mid ?? infoGroup.mId;
									infoGroup.evaluate = data?.evaluate ?? infoGroup.evaluate;
									infoGroup.type = "PGC";
									// 有剧集信息
									if (data?.modules) {
										// 解锁剧集信息限制
										data.modules = setModules(data?.modules);
									}									infoGroup.locales = detectLocales(infoGroup);
									setCache(infoGroup, getEpisodes(data?.modules), Caches);
									// 解锁地区限制遮罩
									if (data?.dialog) {
										if (data?.dialog?.code === 6010001) delete data.dialog;
									}									// 解锁弹幕和评论区等限制
									if (data?.rights) {
										data.rights.allow_bp = 1;
										data.rights.allow_download = 1;
										data.rights.allow_demand = 1;
										data.rights.area_limit = 0;
									}									break;
								case "/pgc/view/web/season": // 番剧-内容-web
								case "/pgc/view/pc/season": // 番剧-内容-pc
									let result = body.result;
									infoGroup.seasonTitle = result.season_title ?? infoGroup.seasonTitle;
									infoGroup.seasonId = result.season_id ?? infoGroup.seasonId;
									infoGroup.mId = result.up_info?.mid ?? infoGroup.mId;
									infoGroup.evaluate = result?.evaluate ?? infoGroup.evaluate;
									infoGroup.type = "PGC";
									// 有剧集信息
									if (result?.episodes || result?.section) {
										// 解锁剧集信息限制
										if (result?.episodes) result.episodes = setEpisodes(result.episodes);
										if (result?.section) result.section = setEpisodes(result.section);
									}									infoGroup.locales = detectLocales(infoGroup);
									setCache(infoGroup, result?.episodes, Caches);
									// 解锁弹幕和评论区等限制
									if (result?.rights) {
										result.rights.allow_bp = 1;
										result.rights.area_limit = 0;
										result.rights.can_watch = 1;
										result.allow_download = 1;
										result.allow_bp_rank = 1;
									}									break;
							}							break;
					}					$response.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream":
					//log(`🚧 $response.body: ${JSON.stringify($response.body)}`, "");
					let rawBody = ($platform === "Quantumult X") ? new Uint8Array($response.bodyBytes ?? []) : $response.body ?? new Uint8Array();
					//log(`🚧 isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
					switch (FORMAT) {
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
							break;
						case "application/grpc":
						case "application/grpc+proto":
							rawBody = GRPC.decode(rawBody);
							// 解析链接并处理protobuf数据
							// 主机判断
							switch (HOST) {
								case "grpc.biliapi.net": // HTTP/2
								case "app.bilibili.com": // HTTP/1.1
									switch (PATHs?.[0]) {
										case "bilibili.app.viewunite.v1.View":
											switch (PATHs?.[1]) {
												case "View": // 播放页
													body = ViewReply.fromBinary(rawBody);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													rawBody = ViewReply.toBinary(body);
													infoGroup.seasonTitle = body?.arc?.title ?? body?.supplement?.ogv_data?.title ?? infoGroup.seasonTitle;
													infoGroup.seasonId = parseInt(body?.report?.season_id, 10) || body?.supplement?.ogv_data?.season_id || infoGroup.seasonId;
													infoGroup.mId = parseInt(body?.report?.up_mid, 10) || body?.owner?.mid || infoGroup.mId;
													//infoGroup.evaluate = result?.evaluate ?? infoGroup.evaluate;
													if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
													switch (body?.supplement?.typeUrl) {
														case "type.googleapis.com/bilibili.app.viewunite.pgcanymodel.ViewPgcAny":
															infoGroup.type = "PGC";
															break;
														case "type.googleapis.com/bilibili.app.viewunite.ugcanymodel.ViewUgcAny":
														default:
															infoGroup.type = "UGC";
															break;
													}													infoGroup.locales = detectLocales(infoGroup);
													setCache(infoGroup, [], Caches);
													break;
											}											break;
										case "bilibili.app.playurl.v1.PlayURL": // 普通视频
											switch (PATHs?.[1]) {
																							}											break;
										case "bilibili.pgc.gateway.player.v2.PlayURL": // 番剧
											/******************  initialization start  *******************/
											/******************  initialization finish  *******************/
											infoGroup.type = "PGC";
											switch (PATHs?.[1]) {
																							}											break;
										case "bilibili.app.nativeact.v1.NativeAct": // 活动-节目、动画、韩综（港澳台）
											switch (PATHs?.[1]) {
																							}											break;
										case "bilibili.app.interface.v1.Search": // 搜索框
											switch (PATHs?.[1]) {
																							}											break;
										case "bilibili.polymer.app.search.v1.Search": // 搜索结果
											/******************  initialization start  *******************/
											/******************  initialization finish  *******************/
											switch (PATHs?.[1]) {
																							}											break;
									}									break;
							}							rawBody = GRPC.encode(rawBody);
							break;
					}					// 写入二进制数据
					$response.body = rawBody;
					break;
			}			log(`🚧 信息组, infoGroup: ${JSON.stringify(infoGroup)}`, "");
			break;
		case false:
			break;
	}})()
	.catch((e) => logError(e))
	.finally(() => done($response));

/***************** Function *****************/
/**
 * Get Episodes Data
 * @author VirgilClyne
 * @param {Array} modules - Response Body's Data's Modules
 * @return {Array<Object>} Episodes Datas
 */
function getEpisodes(modules = []) {
	log(`⚠ Get Episodes`, "");
	let episodes = modules.flatMap(module => {
		switch (module?.style) {
			case "positive": // 选集
			case "section": // SP
				return module?.data?.episodes;
			case "season": // 选季
				//return module?.data?.seasons;
				return [];
			case "pugv": // 猜你喜欢
			default:
				return [];
		}	});
	/*
	let epids = episodes.map(episode => {
		log(`episode.id: ${episode?.id}`);
		log(`episode: ${JSON.stringify(episode)}`);
		return episode?.id
	});
	*/
	log(`🎉 Get Episodes`, "");
	//log(`🚧 Get Episodes`, `modules.episodes: ${JSON.stringify(episodes)}`, "");
	return episodes;
}
/**
 * Set Modules Data
 * @author NyaMisty & VirgilClyne
 * @param {Array} modules - Response Body's Data's Modules
 * @return {Array<Object>} Modules Datas
 */
function setModules(modules = []) {
	log(`⚠ Set Episodes`, "");
	modules = modules.map(module => {
		switch (module?.style) {
			case "positive": // 选集
			case "section": // SP
				// 解锁弹幕和评论区
				module.data.episodes = setEpisodes(module?.data?.episodes);
				break;
		}		return module;
	});
	log(`🎉 Set Episodes`, "");
	//log(`🚧 Set Episodes`, `modules: ${JSON.stringify(modules)}`, "");
	return modules;
}
/**
 * Set Episodes Data
 * @author NyaMisty & VirgilClyne
 * @param {Array} modules - Response Body's Data's Modules's Episodes
 * @return {Array<Object>} Modules Datas
 */
function setEpisodes(episodes = []) {
	log(`⚠ Set Episodes`, "");
	episodes = episodes.map(episode => {
		if (episode?.badge_info?.text == "受限") {
			episode.badge_info.text = "";
			episode.badge_info.bg_color = "#FB7299";
			episode.badge_info.bg_color_night = "#BB5B76";
		}		if (episode?.rights) {
			episode.rights.allow_dm = 1;
			episode.rights.allow_download = 1;
			episode.rights.allow_demand = 1;
			episode.rights.area_limit = 0;
		}		return episode;
	});
	log(`🎉 Set Episodes`, "");
	//log(`🚧 Set Episodes`, `episodes: ${JSON.stringify(episodes)}`, "");
	return episodes;
}
/**
 * Detect Locales
 * @author VirgilClyne
 * @param {Object} info - Info Group: { seasonTitle: undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}
 * @return {String} locales
 */
function detectLocales(infoGroup = {"seasonTitle": undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}) {
	log(`☑️ Detect Locales`, `seasonTitle: ${infoGroup.seasonTitle}, seasonId: ${infoGroup.seasonId}, epId: ${infoGroup.epId}, mId: ${infoGroup.mId}`, "");
	switch (infoGroup.seasonTitle) {
		case undefined:
		case null:
			infoGroup.locales = detectMId(infoGroup.mId);
			break;
		default:
			infoGroup.locales = detectSeasonTitle(infoGroup.seasonTitle);
			break;
	}	log(`✅ Detect Locales, locales: ${infoGroup.locales}`, "");
	return infoGroup.locales;
	/***************** Functions *****************/
	function detectSeasonTitle(seasonTitle){
		log(`☑️ Detect Season Title`, "");
		let locales = [];
		log([...infoGroup.seasonTitle?.matchAll(/[(\uFF08]([^(\uFF08)\uFF09]+)[)\uFF09]/g)]);
		//log([...infoGroup.seasonTitle?.matchAll(/[(\uFF08]([^(\uFF08)\uFF09]+)[)\uFF09]/g)]?.pop());
		//log([...infoGroup.seasonTitle?.matchAll(/[(\uFF08]([^(\uFF08)\uFF09]+)[)\uFF09]/g)]?.pop()?.[1]);
		switch ([...seasonTitle?.matchAll(/[(\uFF08]([^(\uFF08)\uFF09]+)[)\uFF09]/g)]?.pop()?.[1]) {
			case "僅限港澳台地區":
			case "限僅港澳台地區":
			case "港澳台地區":
				locales = ["HKG", "MAC", "TWN"];
				break;
			case "僅限港台地區":
				locales = ["HKG", "TWN"];
				break;
			case "僅限港澳地區":
			case "僅港澳地區":
				locales = ["HKG", "MAC"];
				break;
			case "僅限台灣地區":
				locales = ["TWN"];
				break;
			case "僅限港澳台及其他地區":
				locales = ["HKG", "MAC", "TWN", "SEA"];
				break;
			case "僅限港澳及其他地區":
				locales = ["HKG", "MAC", "SEA"];
				break;
			case undefined:
			case null:
			default:
				locales = detectMId(infoGroup.mId);
				break;
		}		log(`✅ Detect Season Title, locales: ${locales}`, "");
		return locales;
	}
	function detectMId(mId){
		log(`☑️ Detect mId`, "");
		let locales = [];
		switch (mId) {
			case 928123: // 哔哩哔哩番剧
				locales = ["CHN"];
				break;
			case 11783021: // 哔哩哔哩番剧出差
			case 1988098633: // b站_戲劇咖
			case 2042149112: // b站_綜藝咖
				locales = ["HKG", "MAC", "TWN"];
				break;
			case 15773384: // 哔哩哔哩电影
				locales = ["CHN"];
				break;
			case 4856007: // 迷影社
			case 98627270: // 哔哩哔哩国创
				locales = ["CHN", "HKG", "MAC", "TWN"];
				break;
			case undefined: // 无UP主信息
			case null:
			default: // 其他UP主
				locales = detectTraditional(infoGroup.seasonTitle, infoGroup.evaluate);
				break;
		}		log(`✅ Detect mId, locales: ${locales}`, "");
		return locales;
	}
	function detectTraditional(seasonTitle, evaluate){
		log(`☑️ Detect Traditional`, "");
		let locales = [];
		if (isTraditional(seasonTitle) > 0) { // Traditional Chinese
			locales = ["HKG", "MAC", "TWN"];
		} else if (isTraditional(evaluate) > 1) { // Traditional Chinese
			locales = ["HKG", "MAC", "TWN"];
		} else { // Simplified Chinese
			locales = ["CHN"];
		}		log(`✅ Detect Traditional, locales: ${locales}`, "");
		return locales;
		/***************** Functions *****************/
		/**
		 * is the Strings Traditional Chinese?
		 * @author VirgilClyne
		 * @param {String} strings - Strings to check
		 * @return {Number} Traditional Chinese Count
		 */
		function isTraditional(strings = [""]) {
			log(`☑️ is the Strings Traditional Chinese?`, "");
			const reg = /[䊷䋙䝼䰾䲁丟並乾亂亞佇馀併來侖侶俁係俔俠倀倆倈倉個們倫偉側偵偽傑傖傘備傭傯傳傴債傷傾僂僅僉僑僕僞僥僨價儀儂億儈儉儐儔儕儘償優儲儷儺儻儼兌兒兗內兩冊冪凈凍凜凱別刪剄則剋剎剗剛剝剮剴創劃劇劉劊劌劍劑勁動務勛勝勞勢勩勱勵勸勻匭匯匱區協卻厙厠厭厲厴參叄叢吒吳吶呂咼員唄唚問啓啞啟啢喎喚喪喬單喲嗆嗇嗊嗎嗚嗩嗶嘆嘍嘔嘖嘗嘜嘩嘮嘯嘰嘵嘸嘽噓噝噠噥噦噯噲噴噸噹嚀嚇嚌嚕嚙嚦嚨嚲嚳嚴嚶囀囁囂囅囈囑囪圇國圍園圓圖團垵埡埰執堅堊堖堝堯報場塊塋塏塒塗塢塤塵塹墊墜墮墳墻墾壇壈壋壓壘壙壚壞壟壠壢壩壯壺壼壽夠夢夾奐奧奩奪奬奮奼妝姍姦娛婁婦婭媧媯媼媽嫗嫵嫻嫿嬀嬈嬋嬌嬙嬡嬤嬪嬰嬸孌孫學孿宮寢實寧審寫寬寵寶將專尋對導尷屆屍屓屜屢層屨屬岡峴島峽崍崗崢崬嵐嶁嶄嶇嶔嶗嶠嶢嶧嶮嶴嶸嶺嶼巋巒巔巰帥師帳帶幀幃幗幘幟幣幫幬幹幺幾庫廁廂廄廈廚廝廟廠廡廢廣廩廬廳弒弳張強彈彌彎彙彞彥後徑從徠復徵徹恆恥悅悞悵悶惡惱惲惻愛愜愨愴愷愾慄態慍慘慚慟慣慤慪慫慮慳慶憂憊憐憑憒憚憤憫憮憲憶懇應懌懍懟懣懨懲懶懷懸懺懼懾戀戇戔戧戩戰戱戲戶拋拾挩挾捨捫掃掄掗掙掛採揀揚換揮損搖搗搵搶摑摜摟摯摳摶摻撈撏撐撓撝撟撣撥撫撲撳撻撾撿擁擄擇擊擋擓擔據擠擬擯擰擱擲擴擷擺擻擼擾攄攆攏攔攖攙攛攜攝攢攣攤攪攬敗敘敵數斂斃斕斬斷時晉晝暈暉暘暢暫曄曆曇曉曏曖曠曨曬書會朧東杴桿梔梘條梟梲棄棖棗棟棧棲棶椏楊楓楨業極榪榮榲榿構槍槤槧槨槳樁樂樅樓標樞樣樸樹樺橈橋機橢橫檁檉檔檜檟檢檣檮檯檳檸檻櫃櫓櫚櫛櫝櫞櫟櫥櫧櫨櫪櫫櫬櫱櫳櫸櫻欄權欏欒欖欞欽歐歟歡歲歷歸歿殘殞殤殨殫殮殯殲殺殻殼毀毆毿氂氈氌氣氫氬氳決沒沖況洶浹涇涼淚淥淪淵淶淺渙減渦測渾湊湞湯溈準溝溫滄滅滌滎滬滯滲滷滸滻滾滿漁漚漢漣漬漲漵漸漿潁潑潔潙潛潤潯潰潷潿澀澆澇澗澠澤澦澩澮澱濁濃濕濘濟濤濫濰濱濺濼濾瀅瀆瀉瀏瀕瀘瀝瀟瀠瀦瀧瀨瀲瀾灃灄灑灕灘灝灠灣灤灧災為烏烴無煉煒煙煢煥煩煬熅熒熗熱熲熾燁燈燉燒燙燜營燦燭燴燼燾爍爐爛爭爲爺爾牆牘牽犖犢犧狀狹狽猙猶猻獁獄獅獎獨獪獫獮獰獲獵獷獸獺獻獼玀現琺琿瑋瑒瑣瑤瑩瑪瑲璉璣璦璫環璽瓊瓏瓔瓚甌產産畝畢異畵當疇疊痙痾瘂瘋瘍瘓瘞瘡瘧瘮瘲瘺瘻療癆癇癉癘癟癢癤癥癧癩癬癭癮癰癱癲發皚皰皸皺盜盞盡監盤盧眥眾睏睜睞瞘瞜瞞瞶瞼矓矚矯硜硤硨硯碩碭碸確碼磑磚磣磧磯磽礆礎礙礦礪礫礬礱祿禍禎禕禡禦禪禮禰禱禿秈稅稈稟種稱穀穌積穎穠穡穢穩穫穭窩窪窮窯窵窶窺竄竅竇竈竊竪競筆筍筧筴箋箏節範築篋篔篤篩篳簀簍簞簡簣簫簹簽簾籃籌籙籜籟籠籩籪籬籮粵糝糞糧糲糴糶糹糾紀紂約紅紆紇紈紉紋納紐紓純紕紖紗紘紙級紛紜紝紡紬細紱紲紳紵紹紺紼紿絀終組絅絆絎結絕絛絝絞絡絢給絨絰統絲絳絶絹綁綃綆綈綉綌綏經綜綞綠綢綣綫綬維綯綰綱網綳綴綸綹綺綻綽綾綿緄緇緊緋緑緒緓緔緗緘緙線緝緞締緡緣緦編緩緬緯緱緲練緶緹緻縈縉縊縋縐縑縕縗縛縝縞縟縣縧縫縭縮縱縲縳縵縶縷縹總績繃繅繆繒織繕繚繞繡繢繩繪繫繭繮繯繰繳繸繹繼繽繾纈纊續纍纏纓纖纘纜缽罈罌罰罵罷羅羆羈羋羥義習翹耬耮聖聞聯聰聲聳聵聶職聹聽聾肅脅脈脛脫脹腎腖腡腦腫腳腸膃膚膠膩膽膾膿臉臍臏臘臚臟臠臢臨臺與興舉舊艙艤艦艫艱艷芻苎苧茲荊莊莖莢莧華萇萊萬萵葉葒著葤葦葯葷蒓蒔蒞蒼蓀蓋蓮蓯蓴蓽蔔蔞蔣蔥蔦蔭蕁蕆蕎蕒蕓蕕蕘蕢蕩蕪蕭蕷薀薈薊薌薔薘薟薦薩薴薺藍藎藝藥藪藴藶藹藺蘄蘆蘇蘊蘋蘚蘞蘢蘭蘺蘿虆處虛虜號虧虯蛺蛻蜆蝕蝟蝦蝸螄螞螢螻螿蟄蟈蟎蟣蟬蟯蟲蟶蟻蠅蠆蠐蠑蠟蠣蠨蠱蠶蠻衆術衕衚衛衝衹袞裊裏補裝裡製複褌褘褲褳褸褻襇襏襖襝襠襤襪襯襲見覎規覓視覘覡覥覦親覬覯覲覷覺覽覿觀觴觶觸訁訂訃計訊訌討訐訒訓訕訖託記訛訝訟訢訣訥訩訪設許訴訶診註詁詆詎詐詒詔評詖詗詘詛詞詠詡詢詣試詩詫詬詭詮詰話該詳詵詼詿誄誅誆誇誌認誑誒誕誘誚語誠誡誣誤誥誦誨說説誰課誶誹誼誾調諂諄談諉請諍諏諑諒論諗諛諜諝諞諢諤諦諧諫諭諮諱諳諶諷諸諺諼諾謀謁謂謄謅謊謎謐謔謖謗謙謚講謝謠謡謨謫謬謭謳謹謾證譎譏譖識譙譚譜譫譯議譴護譸譽譾讀變讎讒讓讕讖讜讞豈豎豐豬豶貓貝貞貟負財貢貧貨販貪貫責貯貰貲貳貴貶買貸貺費貼貽貿賀賁賂賃賄賅資賈賊賑賒賓賕賙賚賜賞賠賡賢賣賤賦賧質賫賬賭賴賵賺賻購賽賾贄贅贇贈贊贋贍贏贐贓贔贖贗贛贜赬趕趙趨趲跡踐踴蹌蹕蹣蹤蹺躂躉躊躋躍躑躒躓躕躚躡躥躦躪軀車軋軌軍軑軒軔軛軟軤軫軲軸軹軺軻軼軾較輅輇輈載輊輒輓輔輕輛輜輝輞輟輥輦輩輪輬輯輳輸輻輾輿轀轂轄轅轆轉轍轎轔轟轡轢轤辦辭辮辯農逕這連進運過達違遙遜遞遠適遲遷選遺遼邁還邇邊邏邐郟郵鄆鄉鄒鄔鄖鄧鄭鄰鄲鄴鄶鄺酇酈醖醜醞醫醬醱釀釁釃釅釋釐釒釓釔釕釗釘釙針釣釤釧釩釵釷釹釺鈀鈁鈃鈄鈈鈉鈍鈎鈐鈑鈒鈔鈕鈞鈣鈥鈦鈧鈮鈰鈳鈴鈷鈸鈹鈺鈽鈾鈿鉀鉅鉈鉉鉋鉍鉑鉕鉗鉚鉛鉞鉢鉤鉦鉬鉭鉶鉸鉺鉻鉿銀銃銅銍銑銓銖銘銚銛銜銠銣銥銦銨銩銪銫銬銱銳銷銹銻銼鋁鋃鋅鋇鋌鋏鋒鋙鋝鋟鋣鋤鋥鋦鋨鋩鋪鋭鋮鋯鋰鋱鋶鋸鋼錁錄錆錇錈錏錐錒錕錘錙錚錛錟錠錡錢錦錨錩錫錮錯録錳錶錸鍀鍁鍃鍆鍇鍈鍋鍍鍔鍘鍚鍛鍠鍤鍥鍩鍬鍰鍵鍶鍺鎂鎄鎇鎊鎔鎖鎘鎛鎡鎢鎣鎦鎧鎩鎪鎬鎮鎰鎲鎳鎵鎸鎿鏃鏇鏈鏌鏍鏐鏑鏗鏘鏜鏝鏞鏟鏡鏢鏤鏨鏰鏵鏷鏹鏽鐃鐋鐐鐒鐓鐔鐘鐙鐝鐠鐦鐧鐨鐫鐮鐲鐳鐵鐶鐸鐺鐿鑄鑊鑌鑒鑔鑕鑞鑠鑣鑥鑭鑰鑱鑲鑷鑹鑼鑽鑾鑿钁長門閂閃閆閈閉開閌閎閏閑間閔閘閡閣閥閨閩閫閬閭閱閲閶閹閻閼閽閾閿闃闆闈闊闋闌闍闐闒闓闔闕闖關闞闠闡闤闥阪陘陝陣陰陳陸陽隉隊階隕際隨險隱隴隸隻雋雖雙雛雜雞離難雲電霢霧霽靂靄靈靚靜靦靨鞀鞏鞝鞽韁韃韉韋韌韍韓韙韜韞韻響頁頂頃項順頇須頊頌頎頏預頑頒頓頗領頜頡頤頦頭頮頰頲頴頷頸頹頻頽顆題額顎顏顒顓顔願顙顛類顢顥顧顫顬顯顰顱顳顴風颭颮颯颱颳颶颸颺颻颼飀飄飆飈飛飠飢飣飥飩飪飫飭飯飲飴飼飽飾飿餃餄餅餉養餌餎餏餑餒餓餕餖餚餛餜餞餡館餱餳餶餷餺餼餾餿饁饃饅饈饉饊饋饌饑饒饗饜饞饢馬馭馮馱馳馴馹駁駐駑駒駔駕駘駙駛駝駟駡駢駭駰駱駸駿騁騂騅騌騍騎騏騖騙騤騫騭騮騰騶騷騸騾驀驁驂驃驄驅驊驌驍驏驕驗驚驛驟驢驤驥驦驪驫骯髏髒體髕髖髮鬆鬍鬚鬢鬥鬧鬩鬮鬱魎魘魚魛魢魨魯魴魷魺鮁鮃鮊鮋鮍鮎鮐鮑鮒鮓鮚鮜鮝鮞鮦鮪鮫鮭鮮鮳鮶鮺鯀鯁鯇鯉鯊鯒鯔鯕鯖鯗鯛鯝鯡鯢鯤鯧鯨鯪鯫鯴鯷鯽鯿鰁鰂鰃鰈鰉鰍鰏鰐鰒鰓鰜鰟鰠鰣鰥鰨鰩鰭鰮鰱鰲鰳鰵鰷鰹鰺鰻鰼鰾鱂鱅鱈鱉鱒鱔鱖鱗鱘鱝鱟鱠鱣鱤鱧鱨鱭鱯鱷鱸鱺鳥鳧鳩鳬鳲鳳鳴鳶鳾鴆鴇鴉鴒鴕鴛鴝鴞鴟鴣鴦鴨鴯鴰鴴鴷鴻鴿鵁鵂鵃鵐鵑鵒鵓鵜鵝鵠鵡鵪鵬鵮鵯鵲鵷鵾鶄鶇鶉鶊鶓鶖鶘鶚鶡鶥鶩鶪鶬鶯鶲鶴鶹鶺鶻鶼鶿鷀鷁鷂鷄鷈鷊鷓鷖鷗鷙鷚鷥鷦鷫鷯鷲鷳鷸鷹鷺鷽鷿鸇鸌鸏鸕鸘鸚鸛鸝鸞鹵鹹鹺鹽麗麥麩麵麽黃黌點黨黲黶黷黽黿鼉鼴齊齋齎齏齒齔齕齗齙齜齟齠齡齦齪齬齲齶齷龍龎龐龔龕龜]/;
			const isTraditional = [...strings].map(string => bool = (string?.match(reg)) ? true : false);
			//console.log("isTraditional: " + isTraditional)
			const sumEqual = isTraditional.reduce((prev, current, index, arr) => {
				return prev + current
			});
			log(`✅ is the Strings Traditional Chinese?`, `sumEqual: ${sumEqual}`, "");
			return sumEqual;
		}	}}
/**
 * Set Cache
 * @author VirgilClyne
 * @param {Object} info - Info Group: { seasonTitle: undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}
 * @param {Array} episodes - Episodes info
 * @param {Object} cache - Caches
 * @return {Array<Boolean>} is setJSON success?
 */
function setCache(infoGroup = { seasonTitle: undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}, episodes = [], cache = {}) {
	log(`☑️ Set Cache`, `seasonTitle: ${infoGroup.seasonTitle}, seasonId: ${infoGroup.seasonId}, epId: ${infoGroup.epId}, mId: ${infoGroup.mId}`, "");
	let isSaved = false;
	if (infoGroup.locales?.length > 0) {
		if (infoGroup.seasonId) cache.ss.set(infoGroup.seasonId, infoGroup.locales);
		if (infoGroup.epId) cache.ep.set(infoGroup.epId, infoGroup.locales);
		episodes.forEach(episode => cache.ep.set(episode?.id, infoGroup.locales));
		cache.ss = Array.from(cache.ss).slice(-100); // Map转Array.限制缓存大小
		cache.ep = Array.from(cache.ep).slice(-1000); // Map转Array.限制缓存大小
		isSaved = Storage.setItem("@BiliBili.Global.Caches", cache);
	}	log(`✅ Set Cache, locales: ${infoGroup.locales}, isSaved: ${isSaved}`, "");
	//log(`🚧 Set Cache`, `cache: ${JSON.stringify(cache)}`, "");
	return isSaved;
}
