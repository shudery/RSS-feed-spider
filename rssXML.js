
var xml = `\
<?xml version="1.0" encoding="utf-8" ?>\  
<rss version="2.0">\
<channel>\
  	<title>{rssTitle}</title>\   
	<image>\   
	  <title>{imgTitle}</title>\    
	  <link>{imgUrl}</link>\    
	  <url>{homeUrl}</url>\      
	</image>\  
  <description>{desc}</description>\    
  <link>{homeUrl}</link>\    
  <language>zh-cn</language>\   
  <generator>WWW.SINA.COM.CN</generator>\     
  <ttl>5</ttl>\    
  <copyright>MIT</copyright>\     
  <pubDate>{pubDate}</pubDate>\   
  <category />\    
 {items}\
 </channel>\  
</rss>\  
`;
var item = `\
<item>\    
  <title>{itemTitle}</title>\    
  <link>{itemUrl}</link>\     
  <author>{author}</author>\     
  <guid>{guid}</guid>\   
  <!-- <category>{category}</category>\ -->
  <pubDate>{itemDate}</pubDate>\    
  <comments />\     
  <description>{itemDesc}</description>\    
  </item>\
`;

module.exports = {
	item,
	xml,
}