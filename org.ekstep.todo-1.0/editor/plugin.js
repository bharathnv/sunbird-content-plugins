/**
 *
 * Plugin to get todos form community portal
 * @class todos
 * @extends EkstepEditor.basePlugin
 *
 * @author Gourav More <gourav_m@tekditechnologies.com>
 * @listens
 */

EkstepEditor.basePlugin.extend({
    initialize: function() {
		this.initData();
		EkstepEditorAPI.addEventListener("stage:afterselect", this.controllerCallback, this);
    },
    initData: function(){
		var instance = this;
	},
    controllerCallback: function(event, data) {
		ctrl = this;
		/*TODO*/
		setTimeout(function(){
			ctrl.getTodos();
		}, 3000);

		ctrl.getTodos = function()
		{
			var obj = {};
			var widgetRef;

			if (EkstepEditorAPI.globalContext.contentId)
			{
				obj["url"]      = "index.php?option=com_ekcontent&view=content&id="+EkstepEditorAPI.globalContext.contentId;
				obj["status"]   = "i";
				obj["type"]     = "todos";
				obj["subtype"]  = "reviewer#"+data.stageId;
				obj["client"]   = "content.jlike_ekcontent";
				obj["cont_id"]  = EkstepEditorAPI.globalContext.contentId;
				obj["title"]    = EkstepEditorAPI.getService('content').getContentMeta(obj["cont_id"]);

				outTempRender = '<table class="ui small compact celled definition table"><tbody id="reportedIssue"></tbody></tbody>';

				var tempRender = [
					'<tr>',
					  '<td class="collapsing">',
						'<div class="ui fitted slider checkbox todoCheck">',
						  "<input type='checkbox' id='todo<%= id %>' data-jlike-id='<%= id %>' name='todo<%= id %>' data-ek-todomsg='<%= sender_msg %>'><label></label>",
						'</div>',
					 '</td>',
					  '<td><%= sender_msg %><div><small style="opacity:.5;">Reprted on <%= moment(created).fromNow() %></small></div></td>',
					'</tr>',
				];

				widgetRef = EkstepEditorAPI.jQuery("#pageLevelTodos");

				/**Update widget attribute as per page**/
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-url', obj["url"]);
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-status', obj["status"]);
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-type', obj["type"]);
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-subtype', obj["subtype"]);
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-client', obj["client"]);
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-cont-id', obj["cont_id"] );
				EkstepEditorAPI.jQuery(widgetRef).attr('data-jlike-title', obj["title"]);

				EkstepEditorAPI.jQuery("#pageLevelTodos").jltodos();

				obj["content_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
				obj["assigned_by"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
				obj["assigned_to"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");
				obj["state"]=1;
				obj["status"] = "I";

				/**Render todos**/
				EkstepEditorAPI.jQuery("#pageLevelTodos").jltodos({obj:obj, action:'renderTodos', tempRender:tempRender, outTempRender:outTempRender});

				obj["status"] = "C";
				/**Render resovled todos**/
				EkstepEditorAPI.jQuery("#pageLevelResolvedTodos").addClass('ui relaxed divided list');
				EkstepEditorAPI.jQuery("#pageLevelResolvedTodos").jltodos({obj:obj, action:'renderTodos'});

				EkstepEditorAPI.jQuery('.checkbox.todoCheck')
				  .checkbox({
					onChecked: function() {
					  ctrl.updateStatus(this);
					}
				  })
				;
			}
		}

		ctrl.updateStatus = function(ref)
		{
			var widgetRef = EkstepEditorAPI.jQuery('#pageLevelTodos');

			var status  = 'I';

			if ((ref).checked == true){
				status = 'C';
			}

			id=EkstepEditorAPI.jQuery(ref).attr("data-jlike-id");
			todotext=EkstepEditorAPI.jQuery(ref).attr("data-ek-todomsg");

			/**Update todo status**/
			setTimeout(function(){
				ctrl.save(widgetRef, status, id, todotext);
			}, 300);
		},
		ctrl.save = function(widgetRef, status, id, todotext, callback = function() { ctrl.getTodos();})
		{
			var obj = {};

			obj['id']=id;
			obj["sender_msg"]=todotext;

			obj["url"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-url");
			obj["cont_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-cont-id");
			obj["type"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-type");
			obj["subtype"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-subtype");
			obj["client"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-client");
			obj["content_id"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-contentid");
			obj["assigned_by"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_by");
			obj["assigned_to"]=EkstepEditorAPI.jQuery(widgetRef).attr("data-jlike-assigned_to");

			obj["state"]=1;

			if (status != null  && status != undefined)
			{
				obj["status"] = status;
			}

			EkstepEditorAPI.jQuery(widgetRef).jltodos({obj:obj,action: 'createTodo'});

			callback();
		}
    }
});
//# sourceURL=todo.js
