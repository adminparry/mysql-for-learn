#树形菜单
``` sql
DROP TABLE IF EXISTS `department_info`;
CREATE TABLE `department_info` (
  `depart_id` varchar(32) NOT NULL COMMENT '部门id',
  `depart_name` varchar(50) DEFAULT NULL COMMENT '部门名称',
  `parentid` varchar(32) DEFAULT NULL COMMENT '部门父id',
  `depart_type` int(11) DEFAULT '1' COMMENT '类型(1 联社 2部门 3网点)',
  `depart_order` int(11) DEFAULT NULL COMMENT '排序号',
  `del_time` datetime DEFAULT NULL COMMENT '删除时间',
  `address` varchar(500) DEFAULT NULL,
  `depart_phone` varchar(11) DEFAULT NULL,
  `organ_id` varchar(32) DEFAULT NULL COMMENT '机构ID',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `status` int(11) DEFAULT '1' COMMENT '状态（1：可见，2：隐藏）',
  PRIMARY KEY (`depart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
-- ----------------------------
-- Records of department_info
-- ----------------------------
INSERT INTO `department_info` VALUES ('0c0a656e48ac4070bc9d815c7d941fc5', '办公室', null, '1', null, null, null, null, null, '2016-07-05 14:59:50', '1');
INSERT INTO `department_info` VALUES ('0e655c7c298a4efdb3fafeeac2c8a049', '昆明北京路营业厅', 'ffadacc1bd964999a666b87642ea4813', '3', null, null, '昆明北京路', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('1bdf8270e8654e40866f2a95f3a3b37d', '信贷部', null, '1', null, null, null, null, null, '2016-07-10 15:42:05', '1');
INSERT INTO `department_info` VALUES ('689786b7253a405aa94008f81e222512', '昆明信贷', '1bdf8270e8654e40866f2a95f3a3b37d', '2', null, null, '昆明', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('7dba664830e8480cb5dbf142bf668262', '玉溪信贷部', '1bdf8270e8654e40866f2a95f3a3b37d', '2', null, null, '玉溪', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('9213d0c55fa44185bb7559eeed7ceea1', '营业部', null, '1', null, null, null, null, null, '2016-07-05 15:00:06', '1');
INSERT INTO `department_info` VALUES ('b28c8b7074db49b1b835beb894feace7', '党建部', null, '1', null, null, null, null, null, '2016-07-10 15:41:04', '1');
INSERT INTO `department_info` VALUES ('b436cb4faef7456aa1e169c7fa4cfffa', '昆明拓东营业厅', 'ffadacc1bd964999a666b87642ea4813', '3', null, null, '昆明拓东', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('c30287fd04f943bebe2e2d441dcaab9d', '玉溪信贷部', '1bdf8270e8654e40866f2a95f3a3b37d', '1', null, '2016-07-10 15:54:02', '玉溪', '11', 'f7b9d748061948e693b54d86c9344a81', null, '1');
INSERT INTO `department_info` VALUES ('c54f9a0d66434ffa87054004cb1dca01', '昆明办公室', '0c0a656e48ac4070bc9d815c7d941fc5', '2', null, null, '昆明', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('d0f5d72cb64c40f3be0a510141467253', '玉溪营业厅', '9213d0c55fa44185bb7559eeed7ceea1', '3', null, null, '玉溪', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('e11fdd8b107647bda4fbef1b8ebb015c', '玉溪办公室', '0c0a656e48ac4070bc9d815c7d941fc5', '2', null, null, '玉溪', '123456', null, null, '1');
INSERT INTO `department_info` VALUES ('ec3d13c0c6db4e2084470eda5f8b294e', '科技部', null, '1', null, null, null, null, null, '2016-07-10 15:41:34', '1');
INSERT INTO `department_info` VALUES ('ffadacc1bd964999a666b87642ea4813', '昆明营业厅tqm', 'c54f9a0d66434ffa87054004cb1dca01', '2', null, null, '昆明', '123456', null, null, '1');
```

## 实体类
``` java
public class Department implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    // Fields
    private String depart_id;//唯一id
    private String parentid;//父id
    private String depart_name;
    private Integer depart_type;
    private Integer depart_order;
    private Integer status;
    private String address;
    private String depart_phone;
    private String organ_id;
    private Date del_time;
    private Date create_time;
 
    public Department() {
    }
  //。。。省略set和get方法
 
}
```

## servlet

``` java
public class TreeServlet extends HttpServlet {
 
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }
 
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        Map<String, Object> map = new HashMap<String, Object>();
        DepartmentDAO dao = new DepartmentDAO();
        List<Department> list = dao.getDepartments();
        TreeList tree = new TreeList(list);
        List<Department> listTree = tree.buildTree();
        map.put("rows", listTree);
        map.put("total", listTree.size());
        String str = JSONObject.toJSONString(map);
        response.getWriter().write(str);
    }
}
```

## 循环
``` java 
package com.yydhy.treetable;
 
import java.util.ArrayList;
import java.util.List;
 
/**
 * 根据实体类生成属性表格菜单 实体类有两个必须属性（set get方法） 会自动按照（id/pid）顺序递归对list集合内容排序 String
 * depart_id;//唯一id String parentid;//父id
 *此处如果父ID和id不同 可以修改代码中相关代码就可以
 * @author Administrator
 */
public class TreeList {
    private List<Department> resultNodes = new ArrayList<Department>();//树形结构排序之后list内容
    private List<Department> nodes; //传入list参数
    public TreeList(List<Department> nodes) {//通过构造函数初始化
        this.nodes = nodes;
    }
 
    /**
     * 构建树形结构list
     * @return 返回树形结构List列表
     */
    public List<Department> buildTree() {
        for (Department node : nodes) {
            String id = node.getDepart_id();
            if (node.getParentid() == null) {//通过循环一级节点 就可以通过递归获取二级以下节点
                resultNodes.add(node);//添加一级节点
                build(node);//递归获取二级、三级、。。。节点
            }
        }
        return resultNodes;
    }
    /**
     * 递归循环子节点
     *
     * @param node 当前节点
     */
    private void build(Department node) {
        List<Department> children = getChildren(node);
        if (!children.isEmpty()) {//如果存在子节点
            for (Department child : children) {//将子节点遍历加入返回值中
                resultNodes.add(child);
                build(child);
            }
        }
    }
    /**
     * @param node
     * @return 返回
     */
    private List<Department> getChildren(Department node) {
        List<Department> children = new ArrayList<Department>();
        String id = node.getDepart_id();
        for (Department child : nodes) {
            if (id.equals(child.getParentid())) {//如果id等于父id
                children.add(child);//将该节点加入循环列表中
            }
        }
        return children;
    }
 
}	

```


## 菜单实体类
``` java
public class Menu {
  // 菜单id
  private String id;
  // 菜单名称
  private String name;
  // 父菜单id
  private String parentId;
  // 菜单url
  private String url;
  // 菜单图标
  private String icon;
  // 菜单顺序
  private int order;
  // 子菜单
  private List<Menu> children;
  // ... 省去getter和setter方法以及toString方法
}
```
## 菜单一般需要排序，我们根据Menu的order字段进行排序：
``` java 
/*
  * 排序,根据order排序
  */
 public Comparator<Menu> order(){
   Comparator<Menu> comparator = new Comparator<Menu>() {
     @Override
     public int compare(Menu o1, Menu o2) {
       if(o1.getOrder() != o2.getOrder()){
         return o1.getOrder() - o2.getOrder();
       }
       return 0;
     }
   };
   return comparator;
 }
 ```
## 生成树方法
``` java 
public Map<String,Object> findTree(){
  Map<String,Object> data = new HashMap<String,Object>();
    try {//查询所有菜单
      List<Menu> allMenu = menuDao.findTree();
      //根节点
      List<Menu> rootMenu = new ArrayList<Menu>();
      for (Menu nav : allMenu) {
        if(nav.getParentId().equals("0")){//父节点是0的，为根节点。
          rootMenu.add(nav);
        }
      }
      /* 根据Menu类的order排序 */
      Collections.sort(rootMenu, order());
      //为根菜单设置子菜单，getClild是递归调用的
      for (Menu nav : rootMenu) {
        /* 获取根节点下的所有子节点 使用getChild方法*/
        List<Menu> childList = getChild(nav.getId(), allMenu);
        nav.setChildren(childList);//给根节点设置子节点
      }
      /**
       * 输出构建好的菜单数据。
       * 
       */
      data.put("success", "true");
      data.put("list", rootMenu);
      return data;
    } catch (Exception e) {
      data.put("success", "false");
      data.put("list", new ArrayList());
      return data;
    }
  }
  ```
  ## 获取子菜单：
  ```
  /**
   * 获取子节点
   * @param id 父节点id
   * @param allMenu 所有菜单列表
   * @return 每个根节点下，所有子菜单列表
   */
  public List<Menu> getChild(String id,List<Menu> allMenu){
    //子菜单
    List<Menu> childList = new ArrayList<Menu>();
    for (Menu nav : allMenu) {
      // 遍历所有节点，将所有菜单的父id与传过来的根节点的id比较
      //相等说明：为该根节点的子节点。
      if(nav.ParentId().equals(id)){
        childList.add(nav);
      }
    }
    //递归
    for (Menu nav : childList) {
      nav.setChildren(getChild(nav.getId(), allMenu));
    }
    Collections.sort(childList,order());//排序
    //如果节点下没有子节点，返回一个空List（递归退出）
    if(childList.size() == 0){
      return new ArrayList<Menu>();
    }
    return childList;
  }
  ```